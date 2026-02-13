import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Edit2, Plus, Users, DollarSign, CheckSquare, Search, ChevronLeft, ChevronRight, Check, X, Eye, CreditCard, CalendarDays, History, Info } from 'lucide-react';

const BeehindStudioPlatform = () => {
  const partners = ['Giorgina', 'Simo', 'Edom', 'Mino', 'Edob'];
  
  const partnerColors = {
    'Giorgina': { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-800', dark: 'bg-pink-600', light: 'bg-pink-50' },
    'Simo': { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800', dark: 'bg-blue-600', light: 'bg-blue-50' },
    'Edom': { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800', dark: 'bg-purple-600', light: 'bg-purple-50' },
    'Mino': { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800', dark: 'bg-yellow-600', light: 'bg-yellow-50' },
    'Edob': { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800', dark: 'bg-green-600', light: 'bg-green-50' }
  };
  
  const [mainSection, setMainSection] = useState('todo');
  const [activePartner, setActivePartner] = useState('Tutti');
  
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [accountingView, setAccountingView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendarFilter, setCalendarFilter] = useState('Tutti');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null); // NUOVO: per aprire i giorni
  
  const [tasks, setTasks] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  
  const [showClientModal, setShowClientModal] = useState(false);
  const [showClientInfoModal, setShowClientInfoModal] = useState(false); // NUOVO: modale info cliente
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showClientHistoryModal, setShowClientHistoryModal] = useState(false);
  const [showDayPaymentsModal, setShowDayPaymentsModal] = useState(false); // NUOVO: modale giorno calendario
  const [editingItem, setEditingItem] = useState(null);
  const [editingPartialPayment, setEditingPartialPayment] = useState(null); // NUOVO: per modificare pagamenti parziali
  const [selectedClient, setSelectedClient] = useState(null);
  
  const [newClient, setNewClient] = useState({
    name: '',
    amount: '',
    paymentType: 'fixed_day',
    fixedDay: '',
    videoCount: '',
    paymentMethod: 'bank_transfer',
    assignedTo: partners[0], // NUOVO: responsabile cliente
    notes: ''
  });
  
  const [newPayment, setNewPayment] = useState({
    clientId: '',
    customClientName: '',
    amount: '',
    deadline: '',
    assignedTo: partners[0],
    description: '',
    paid: false,
    partialPayments: []
  });
  
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [partialAmount, setPartialAmount] = useState('');
  const [partialNote, setPartialNote] = useState('');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: 'Tutti',
    completed: false
  });
  
  const [newShoppingItem, setNewShoppingItem] = useState({
    item: '',
    completed: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsData = await window.storage.get('beehind-clients-v3');
        const paymentsData = await window.storage.get('beehind-payments-v3');
        const tasksData = await window.storage.get('beehind-tasks-v3');
        const shoppingData = await window.storage.get('beehind-shopping-v2');
        
        if (clientsData) setClients(JSON.parse(clientsData.value));
        if (paymentsData) setPayments(JSON.parse(paymentsData.value));
        if (tasksData) setTasks(JSON.parse(tasksData.value));
        if (shoppingData) setShoppingList(JSON.parse(shoppingData.value));
      } catch (error) {
        console.log('No existing data, starting fresh');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await window.storage.set('beehind-clients-v3', JSON.stringify(clients));
        await window.storage.set('beehind-payments-v3', JSON.stringify(payments));
        await window.storage.set('beehind-tasks-v3', JSON.stringify(tasks));
        await window.storage.set('beehind-shopping-v2', JSON.stringify(shoppingList));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    if (clients.length > 0 || payments.length > 0 || tasks.length > 0 || shoppingList.length > 0) {
      saveData();
    }
  }, [clients, payments, tasks, shoppingList]);

  useEffect(() => {
    const cleanupOldCompleted = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      
      const updatedTasks = tasks.filter(task => {
        if (!task.completed) return true;
        const completedDate = new Date(task.completedAt || task.createdAt);
        return completedDate > yesterday;
      });
      
      const updatedShopping = shoppingList.filter(item => {
        if (!item.completed) return true;
        const completedDate = new Date(item.completedAt || item.createdAt);
        return completedDate > yesterday;
      });
      
      const updatedPayments = payments.filter(payment => {
        if (!payment.paid) return true;
        const paidDate = new Date(payment.paidAt || payment.createdAt);
        return paidDate > yesterday;
      });
      
      if (updatedTasks.length !== tasks.length) setTasks(updatedTasks);
      if (updatedShopping.length !== shoppingList.length) setShoppingList(updatedShopping);
      if (updatedPayments.length !== payments.length) setPayments(updatedPayments);
    };
    
    const interval = setInterval(cleanupOldCompleted, 3600000);
    cleanupOldCompleted();
    
    return () => clearInterval(interval);
  }, [tasks, shoppingList, payments]);

  // MODIFICATO: FIX per generare pagamenti al giorno corretto (es. 25 invece di 24)
  useEffect(() => {
    const generateRecurringPayments = () => {
      const today = new Date();
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(today.getMonth() + 6);
      
      clients.forEach(client => {
        if (client.paymentType === 'fixed_day' && client.fixedDay) {
          let currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
          
          while (currentDate <= sixMonthsLater) {
            // FIX: Usa direttamente il giorno come numero
            const day = parseInt(client.fixedDay);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // Crea la data esattamente al giorno specificato
            const paymentDate = new Date(year, month, day);
            const dateStr = paymentDate.toISOString().split('T')[0];
            
            const existingPayment = payments.find(p => 
              p.clientId === client.id && 
              p.deadline === dateStr
            );
            
            if (!existingPayment && paymentDate >= today) {
              const newPayment = {
                id: Date.now() + Math.random(),
                clientId: client.id,
                customClientName: '',
                amount: client.amount,
                deadline: dateStr,
                assignedTo: client.assignedTo || partners[0],
                description: 'Pagamento ricorrente',
                paid: false,
                partialPayments: [],
                isRecurring: true,
                createdAt: new Date().toISOString()
              };
              
              setPayments(prev => [...prev, newPayment]);
            }
            
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
        }
      });
    };
    
    if (clients.length > 0) {
      generateRecurringPayments();
    }
  }, [clients]);

  const sortByStatus = (items, completedField = 'completed') => {
    return [...items].sort((a, b) => {
      if (a[completedField] === b[completedField]) {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return a[completedField] ? 1 : -1;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // MODIFICATO: FIX per "cliente sconosciuto"
  const getClientName = (payment) => {
    if (payment.customClientName && payment.customClientName.trim()) {
      return payment.customClientName;
    }
    if (payment.clientId) {
      const client = clients.find(c => c.id === payment.clientId);
      return client ? client.name : 'Cliente sconosciuto';
    }
    return 'Cliente sconosciuto';
  };

  const getRemainingAmount = (payment) => {
    if (!payment.partialPayments || payment.partialPayments.length === 0) {
      return parseFloat(payment.amount);
    }
    const totalPaid = payment.partialPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    return parseFloat(payment.amount) - totalPaid;
  };

  const getClientPaymentHistory = (clientId) => {
    return payments
      .filter(p => p.clientId === clientId)
      .sort((a, b) => new Date(b.deadline || b.createdAt) - new Date(a.deadline || a.createdAt));
  };

  const addClient = () => {
    if (!newClient.name.trim()) return;
    
    const client = {
      ...newClient,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setClients([...clients, client]);
    setNewClient({
      name: '',
      amount: '',
      paymentType: 'fixed_day',
      fixedDay: '',
      videoCount: '',
      paymentMethod: 'bank_transfer',
      assignedTo: partners[0],
      notes: ''
    });
    setShowClientModal(false);
  };

  const updateClient = () => {
    setClients(clients.map(c => c.id === editingItem.id ? { ...newClient, id: c.id, createdAt: c.createdAt } : c));
    setNewClient({
      name: '',
      amount: '',
      paymentType: 'fixed_day',
      fixedDay: '',
      videoCount: '',
      paymentMethod: 'bank_transfer',
      assignedTo: partners[0],
      notes: ''
    });
    setEditingItem(null);
    setShowClientModal(false);
  };

  const deleteClient = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo cliente?')) {
      setClients(clients.filter(c => c.id !== id));
      setPayments(payments.filter(p => p.clientId !== id));
    }
  };

  const addPayment = () => {
    if ((!newPayment.clientId && !newPayment.customClientName.trim()) || !newPayment.amount) return;
    
    const payment = {
      ...newPayment,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      partialPayments: []
    };
    
    setPayments([...payments, payment]);
    setNewPayment({
      clientId: '',
      customClientName: '',
      amount: '',
      deadline: '',
      assignedTo: partners[0],
      description: '',
      paid: false,
      partialPayments: []
    });
    setShowPaymentModal(false);
  };

  const updatePayment = () => {
    setPayments(payments.map(p => p.id === editingItem.id ? { ...newPayment, id: p.id, createdAt: p.createdAt, partialPayments: p.partialPayments } : p));
    setNewPayment({
      clientId: '',
      customClientName: '',
      amount: '',
      deadline: '',
      assignedTo: partners[0],
      description: '',
      paid: false,
      partialPayments: []
    });
    setEditingItem(null);
    setShowPaymentModal(false);
  };

  const deletePayment = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo pagamento?')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const addPartialPayment = () => {
    if (!partialAmount || parseFloat(partialAmount) <= 0) return;
    
    const remaining = getRemainingAmount(selectedPayment);
    const amount = Math.min(parseFloat(partialAmount), remaining);
    
    const partial = {
      amount: amount,
      date: new Date().toISOString(),
      note: partialNote || '',
      id: Date.now()
    };
    
    const updatedPayment = {
      ...selectedPayment,
      partialPayments: [...(selectedPayment.partialPayments || []), partial]
    };
    
    const newRemaining = getRemainingAmount(updatedPayment);
    if (newRemaining <= 0.01) {
      updatedPayment.paid = true;
      updatedPayment.paidAt = new Date().toISOString();
    }
    
    setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p));
    setSelectedPayment(updatedPayment);
    setPartialAmount('');
    setPartialNote('');
  };

  // NUOVO: Funzione per modificare un pagamento parziale
  const updatePartialPayment = (partialId, newAmount, newNote) => {
    const updatedPayment = {
      ...selectedPayment,
      partialPayments: selectedPayment.partialPayments.map(pp => 
        pp.id === partialId ? { ...pp, amount: parseFloat(newAmount), note: newNote } : pp
      )
    };
    
    setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p));
    setSelectedPayment(updatedPayment);
    setEditingPartialPayment(null);
  };

  // NUOVO: Funzione per eliminare un pagamento parziale
  const deletePartialPayment = (partialId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo pagamento parziale?')) {
      const updatedPayment = {
        ...selectedPayment,
        partialPayments: selectedPayment.partialPayments.filter(pp => pp.id !== partialId)
      };
      
      setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p));
      setSelectedPayment(updatedPayment);
    }
  };

  const togglePaymentStatus = (id) => {
    setPayments(payments.map(p => 
      p.id === id ? { 
        ...p, 
        paid: !p.paid,
        paidAt: !p.paid ? new Date().toISOString() : null
      } : p
    ));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      ...newTask,
      assignedTo: activePartner !== 'Tutti' ? activePartner : newTask.assignedTo,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      deadline: '',
      assignedTo: 'Tutti',
      completed: false
    });
    setShowTaskModal(false);
  };

  const updateTask = () => {
    setTasks(tasks.map(t => t.id === editingItem.id ? { ...newTask, id: t.id, createdAt: t.createdAt, completed: t.completed } : t));
    setNewTask({
      title: '',
      description: '',
      deadline: '',
      assignedTo: 'Tutti',
      completed: false
    });
    setEditingItem(null);
    setShowTaskModal(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { 
        ...t, 
        completed: !t.completed,
        completedAt: !t.completed ? new Date().toISOString() : null
      } : t
    ));
  };

  const addShoppingItem = () => {
    if (!newShoppingItem.item.trim()) return;
    
    const item = {
      ...newShoppingItem,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setShoppingList([...shoppingList, item]);
    setNewShoppingItem({
      item: '',
      completed: false
    });
    setShowShoppingModal(false);
  };

  const toggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(s => 
      s.id === id ? { 
        ...s, 
        completed: !s.completed,
        completedAt: !s.completed ? new Date().toISOString() : null
      } : s
    ));
  };

  const deleteShoppingItem = (id) => {
    setShoppingList(shoppingList.filter(s => s.id !== id));
  };

  const getFilteredPayments = () => {
    let filtered = payments;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => {
        const clientName = getClientName(payment).toLowerCase();
        const assignedTo = payment.assignedTo.toLowerCase();
        const description = (payment.description || '').toLowerCase();
        
        return clientName.includes(term) || 
               assignedTo.includes(term) || 
               description.includes(term);
      });
    }
    
    return sortByStatus(filtered, 'paid');
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getPaymentsForDate = (dateStr) => {
    let filtered = payments.filter(p => p.deadline === dateStr);
    
    if (calendarFilter !== 'Tutti') {
      filtered = filtered.filter(p => p.assignedTo === calendarFilter);
    }
    
    return filtered;
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const handleClientSelection = (clientIdStr) => {
    if (!clientIdStr) {
      setNewPayment({
        ...newPayment,
        clientId: '',
        customClientName: '',
        amount: '',
        assignedTo: partners[0]
      });
      return;
    }
    
    const clientId = parseInt(clientIdStr);
    const client = clients.find(c => c.id === clientId);
    
    if (client) {
      setNewPayment({
        ...newPayment,
        clientId: clientId,
        customClientName: '',
        amount: client.amount || '',
        assignedTo: client.assignedTo || partners[0]
      });
    } else {
      setNewPayment({
        ...newPayment,
        clientId: clientId,
        customClientName: '',
        assignedTo: partners[0]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-3xl">🐝</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Beehind Studio</h1>
                <p className="text-amber-100 text-sm">Gestione Attività e Contabilità</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMainSection('clients')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                mainSection === 'clients'
                  ? 'bg-amber-600 text-white border-b-4 border-amber-800'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              <Users size={20} />
              Clienti
            </button>
            <button
              onClick={() => setMainSection('accounting')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                mainSection === 'accounting'
                  ? 'bg-amber-600 text-white border-b-4 border-amber-800'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              <CreditCard size={20} />
              Contabilità
            </button>
            <button
              onClick={() => setMainSection('todo')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                mainSection === 'todo'
                  ? 'bg-amber-600 text-white border-b-4 border-amber-800'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              <CheckSquare size={20} />
              To Do
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* SEZIONE CLIENTI - MODIFICATO: Solo nome, info tramite bottone */}
        {mainSection === 'clients' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-end items-center mb-6">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowClientModal(true);
                }}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center gap-2"
              >
                <Plus size={20} />
                Nuovo Cliente
              </button>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {clients.map(client => (
                <div key={client.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-amber-400 transition bg-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800 flex-1 truncate">{client.name}</h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientInfoModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Info"
                      >
                        <Info size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientHistoryModal(true);
                        }}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition"
                        title="Storico"
                      >
                        <History size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(client);
                          setNewClient(client);
                          setShowClientModal(true);
                        }}
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition"
                        title="Modifica"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                        title="Elimina"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEZIONE CONTABILITÀ */}
        {mainSection === 'accounting' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setAccountingView('list')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    accountingView === 'list' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <DollarSign className="inline mr-2" size={18} />
                  Lista Pagamenti
                </button>
                <button
                  onClick={() => setAccountingView('weekly')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    accountingView === 'weekly' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CalendarDays className="inline mr-2" size={18} />
                  Settimana
                </button>
                <button
                  onClick={() => setAccountingView('monthly')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    accountingView === 'monthly' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="inline mr-2" size={18} />
                  Mensile
                </button>
              </div>
            </div>

            {accountingView === 'list' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                  <h2 className="text-2xl font-bold text-amber-800">Pagamenti</h2>
                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Cerca cliente o socio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowPaymentModal(true);
                      }}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center gap-2 whitespace-nowrap"
                    >
                      <Plus size={20} />
                      Nuovo
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {getFilteredPayments().length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Nessun pagamento trovato</p>
                    </div>
                  ) : (
                    getFilteredPayments().map(payment => {
                      const remaining = getRemainingAmount(payment);
                      const hasPartials = payment.partialPayments && payment.partialPayments.length > 0;
                      
                      return (
                        <div
                          key={payment.id}
                          className={`border-2 rounded-xl p-4 transition ${
                            payment.paid
                              ? 'bg-green-50 border-green-300 opacity-60'
                              : hasPartials && remaining > 0
                              ? 'bg-yellow-50 border-yellow-400'
                              : isOverdue(payment.deadline)
                              ? 'bg-red-50 border-red-400'
                              : 'bg-white border-gray-200 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <button
                                onClick={() => togglePaymentStatus(payment.id)}
                                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                                  payment.paid ? 'bg-green-500 border-green-600' : 'border-gray-300 hover:border-amber-500'
                                }`}
                              >
                                {payment.paid && <Check size={16} className="text-white" />}
                              </button>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-lg text-gray-800">{getClientName(payment)}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    partnerColors[payment.assignedTo]?.bg
                                  } ${partnerColors[payment.assignedTo]?.text}`}>
                                    {payment.assignedTo}
                                  </span>
                                  {/* MODIFICATO: Badge ricorrente più neutro */}
                                  {payment.isRecurring && (
                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-300">
                                      Auto
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                                  <span className="font-bold text-amber-700">€ {parseFloat(payment.amount).toFixed(2)}</span>
                                  {payment.deadline && (
                                    <span className={isOverdue(payment.deadline) ? 'text-red-600 font-semibold' : ''}>
                                      📅 {formatDate(payment.deadline)}
                                    </span>
                                  )}
                                </div>
                                
                                {hasPartials && remaining > 0 && (
                                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 mb-2">
                                    <div className="text-sm">
                                      <span className="font-semibold text-yellow-800">Parziale:</span>
                                      <span className="ml-2">Pagato € {(parseFloat(payment.amount) - remaining).toFixed(2)}</span>
                                      <span className="ml-2 font-bold text-yellow-900">Rimanente € {remaining.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {payment.description && (
                                  <button
                                    onClick={() => {
                                      setSelectedPayment(payment);
                                      setShowPaymentDetailModal(true);
                                    }}
                                    className="text-sm text-amber-600 hover:text-amber-800 font-semibold"
                                  >
                                    Vedi dettagli →
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem(payment);
                                  setNewPayment(payment);
                                  setShowPaymentModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit2 size={18} />
                              </button>
                              {/* MODIFICATO: FIX eliminazione pagamenti */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deletePayment(payment.id);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Elimina pagamento"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {accountingView === 'weekly' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-amber-800">Pagamenti - Prossimi 7 Giorni</h2>
                  <select
                    value={calendarFilter}
                    onChange={(e) => setCalendarFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Tutti">Tutti</option>
                    {partners.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-7 gap-4">
                  {getWeekDates().map((date, idx) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayPayments = getPaymentsForDate(dateStr);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={idx}
                        className={`border-2 rounded-xl p-4 ${isToday ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}
                      >
                        <div className="text-center mb-3">
                          <div className="font-bold text-gray-700 capitalize">
                            {date.toLocaleDateString('it-IT', { weekday: 'short' })}
                          </div>
                          <div className="text-2xl font-bold text-amber-700">{date.getDate()}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {date.toLocaleDateString('it-IT', { month: 'short' })}
                          </div>
                        </div>
                        
                        {dayPayments.length > 0 ? (
                          <div className="space-y-2">
                            {dayPayments.slice(0, 3).map(payment => (
                              <div
                                key={payment.id}
                                className={`p-2 rounded-lg text-xs ${
                                  payment.paid ? 'bg-green-100 border border-green-300' : 'bg-amber-100 border border-amber-300'
                                }`}
                              >
                                <div className="font-semibold truncate">{getClientName(payment)}</div>
                                <div className="text-gray-600">€ {parseFloat(payment.amount).toFixed(2)}</div>
                              </div>
                            ))}
                            {dayPayments.length > 3 && (
                              <button
                                onClick={() => {
                                  setSelectedCalendarDay({ date: dateStr, payments: dayPayments });
                                  setShowDayPaymentsModal(true);
                                }}
                                className="w-full text-xs text-amber-600 hover:text-amber-800 font-semibold"
                              >
                                +{dayPayments.length - 3} altri
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 text-sm py-2">Nessuno</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CALENDARIO MENSILE - MODIFICATO: Giorni cliccabili, max 2 pagamenti visibili */}
            {accountingView === 'monthly' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const prev = new Date(selectedMonth);
                        prev.setMonth(prev.getMonth() - 1);
                        setSelectedMonth(prev);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-amber-800 capitalize">
                      {selectedMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                      onClick={() => {
                        const next = new Date(selectedMonth);
                        next.setMonth(next.getMonth() + 1);
                        setSelectedMonth(next);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  <select
                    value={calendarFilter}
                    onChange={(e) => setCalendarFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Tutti">Tutti</option>
                    {partners.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-600 py-2">{day}</div>
                  ))}
                  
                  {(() => {
                    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedMonth);
                    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
                    const days = [];
                    
                    for (let i = 0; i < adjustedStart; i++) {
                      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                    }
                    
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayPayments = getPaymentsForDate(dateStr);
                      const isToday = new Date().getDate() === day && 
                                     new Date().getMonth() === month &&
                                     new Date().getFullYear() === year;
                      
                      days.push(
                        <div
                          key={day}
                          onClick={() => {
                            if (dayPayments.length > 0) {
                              setSelectedCalendarDay({ date: dateStr, payments: dayPayments });
                              setShowDayPaymentsModal(true);
                            }
                          }}
                          className={`aspect-square border-2 rounded-lg p-2 ${
                            isToday ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                          } ${dayPayments.length > 0 ? 'cursor-pointer hover:border-amber-400' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="text-sm font-semibold text-gray-700">{day}</div>
                            {/* MODIFICATO: Mostra +n se ci sono più di 2 pagamenti */}
                            {dayPayments.length > 2 && (
                              <div className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                                +{dayPayments.length - 2}
                              </div>
                            )}
                          </div>
                          {dayPayments.length > 0 && (
                            <div className="space-y-1">
                              {dayPayments.slice(0, 2).map(payment => (
                                <div
                                  key={payment.id}
                                  className={`text-xs px-1 py-0.5 rounded truncate ${
                                    payment.paid ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'
                                  }`}
                                  title={`${getClientName(payment)} - € ${payment.amount}`}
                                >
                                  {getClientName(payment)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEZIONE TO DO - MODIFICATO: Task "Tutti" non include personali */}
        {mainSection === 'todo' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setActivePartner('Tutti')}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    activePartner === 'Tutti' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tutti
                </button>
                {partners.map(partner => (
                  <button
                    key={partner}
                    onClick={() => setActivePartner(partner)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                      activePartner === partner 
                        ? `${partnerColors[partner].dark} text-white`
                        : `${partnerColors[partner].light} ${partnerColors[partner].text} hover:${partnerColors[partner].bg}`
                    }`}
                  >
                    {partner}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-amber-800">Task</h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowTaskModal(true);
                  }}
                  className="w-10 h-10 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition flex items-center justify-center"
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="space-y-3">
                {/* MODIFICATO: Se activePartner è "Tutti", mostra solo task con assignedTo="Tutti" */}
                {sortByStatus(tasks.filter(t => 
                  activePartner === 'Tutti' 
                    ? t.assignedTo === 'Tutti' 
                    : t.assignedTo === activePartner
                )).length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <CheckSquare size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Nessuna task</p>
                  </div>
                ) : (
                  sortByStatus(tasks.filter(t => 
                    activePartner === 'Tutti' 
                      ? t.assignedTo === 'Tutti' 
                      : t.assignedTo === activePartner
                  )).map(task => (
                    <div
                      key={task.id}
                      className={`border-2 rounded-xl p-4 transition ${
                        task.completed
                          ? 'bg-green-50 border-green-300 opacity-60'
                          : isOverdue(task.deadline)
                          ? 'bg-red-50 border-red-400'
                          : 'bg-white border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                              task.completed ? 'bg-green-500 border-green-600' : 'border-gray-300 hover:border-amber-500'
                            }`}
                          >
                            {task.completed && <Check size={16} className="text-white" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {task.title}
                              </h3>
                              {task.assignedTo !== 'Tutti' && (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  partnerColors[task.assignedTo]?.bg
                                } ${partnerColors[task.assignedTo]?.text}`}>
                                  {task.assignedTo}
                                </span>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            )}
                            {task.deadline && (
                              <span className={`text-sm ${isOverdue(task.deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                📅 {formatDate(task.deadline)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(task);
                              setNewTask(task);
                              setShowTaskModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-amber-800">Lista Spesa Ufficio</h2>
                <button
                  onClick={() => setShowShoppingModal(true)}
                  className="w-10 h-10 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition flex items-center justify-center"
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="space-y-3">
                {sortByStatus(shoppingList).length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Lista vuota</p>
                  </div>
                ) : (
                  sortByStatus(shoppingList).map(item => (
                    <div
                      key={item.id}
                      className={`border-2 rounded-xl p-4 transition ${
                        item.completed
                          ? 'bg-green-50 border-green-300 opacity-60'
                          : 'bg-white border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleShoppingItem(item.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                              item.completed ? 'bg-green-500 border-green-600' : 'border-gray-300 hover:border-amber-500'
                            }`}
                          >
                            {item.completed && <Check size={16} className="text-white" />}
                          </button>
                          <span className={`font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {item.item}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteShoppingItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL INFO CLIENTE */}
      {showClientInfoModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-amber-800">{selectedClient.name}</h3>
              <button
                onClick={() => {
                  setShowClientInfoModal(false);
                  setSelectedClient(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {selectedClient.amount && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-600">Importo:</span>
                  <span className="text-amber-700 font-bold">€ {selectedClient.amount}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">Tipo:</span>
                <span className="text-gray-800">
                  {selectedClient.paymentType === 'fixed_day' && selectedClient.fixedDay 
                    ? `Giorno ${selectedClient.fixedDay} del mese`
                    : selectedClient.paymentType === 'per_video' 
                    ? `Ogni ${selectedClient.videoCount} video` 
                    : 'Variabile'}
                </span>
              </div>

              {selectedClient.assignedTo && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-600">Responsabile:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    partnerColors[selectedClient.assignedTo]?.bg
                  } ${partnerColors[selectedClient.assignedTo]?.text}`}>
                    {selectedClient.assignedTo}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">Metodo:</span>
                <span className="text-gray-800">
                  {selectedClient.paymentMethod === 'cash' && 'Contanti'}
                  {selectedClient.paymentMethod === 'invoice_simo' && 'Fattura Simo'}
                  {selectedClient.paymentMethod === 'invoice_gio' && 'Fattura Gio'}
                  {selectedClient.paymentMethod === 'invoice_edob' && 'Fattura Edob'}
                  {selectedClient.paymentMethod === 'invoice_edom' && 'Fattura Edom'}
                  {selectedClient.paymentMethod === 'bank_transfer' && 'Bonifico'}
                </span>
              </div>
              
              {selectedClient.notes && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-600 block mb-1">Note:</span>
                  <p className="text-gray-700">{selectedClient.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLIENTE */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              {editingItem ? 'Modifica Cliente' : 'Nuovo Cliente'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Cliente *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Nome cliente..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Importo (€)</label>
                  <input
                    type="number"
                    value={newClient.amount}
                    onChange={(e) => setNewClient({ ...newClient, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Responsabile</label>
                  <select
                    value={newClient.assignedTo}
                    onChange={(e) => setNewClient({ ...newClient, assignedTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    {partners.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo Pagamento</label>
                  <select
                    value={newClient.paymentType}
                    onChange={(e) => setNewClient({ ...newClient, paymentType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="fixed_day">Giorno Fisso</option>
                    <option value="per_video">Per Video</option>
                  </select>
                </div>

                {newClient.paymentType === 'fixed_day' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Giorno Fisso (1-31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={newClient.fixedDay}
                      onChange={(e) => setNewClient({ ...newClient, fixedDay: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="1-31"
                    />
                  </div>
                )}

                {newClient.paymentType === 'per_video' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Numero Video</label>
                    <input
                      type="number"
                      value={newClient.videoCount}
                      onChange={(e) => setNewClient({ ...newClient, videoCount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Es. 10"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Modalità Pagamento</label>
                <select
                  value={newClient.paymentMethod}
                  onChange={(e) => setNewClient({ ...newClient, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="cash">Contanti</option>
                  <option value="invoice_simo">Fattura Simo</option>
                  <option value="invoice_gio">Fattura Gio</option>
                  <option value="invoice_edob">Fattura Edob</option>
                  <option value="invoice_edom">Fattura Edom</option>
                  <option value="bank_transfer">Bonifico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Note</label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows="3"
                  placeholder="Note aggiuntive..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (editingItem) {
                      updateClient();
                    } else {
                      addClient();
                    }
                  }}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  {editingItem ? 'Salva' : 'Aggiungi'}
                </button>
                <button
                  onClick={() => {
                    setShowClientModal(false);
                    setEditingItem(null);
                    setNewClient({
                      name: '',
                      amount: '',
                      paymentType: 'fixed_day',
                      fixedDay: '',
                      videoCount: '',
                      paymentMethod: 'bank_transfer',
                      assignedTo: partners[0],
                      notes: ''
                    });
                  }}
                  className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PAGAMENTO - MODIFICATO: Più compatto */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 my-8">
            <h3 className="text-xl font-bold text-amber-800 mb-3">
              {editingItem ? 'Modifica Pagamento' : 'Nuovo Pagamento'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Cliente</label>
                <select
                  value={newPayment.clientId}
                  onChange={(e) => handleClientSelection(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Seleziona cliente...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                <div className="text-center text-gray-400 text-xs my-1">oppure</div>
                <input
                  type="text"
                  value={newPayment.customClientName}
                  onChange={(e) => setNewPayment({ ...newPayment, customClientName: e.target.value, clientId: '' })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Cliente temporaneo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Importo (€)</label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Scadenza</label>
                  <input
                    type="date"
                    value={newPayment.deadline}
                    onChange={(e) => setNewPayment({ ...newPayment, deadline: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Responsabile</label>
                <select
                  value={newPayment.assignedTo}
                  onChange={(e) => setNewPayment({ ...newPayment, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {partners.map(partner => (
                    <option key={partner} value={partner}>{partner}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows="2"
                  placeholder="Dettagli..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (editingItem) {
                      updatePayment();
                    } else {
                      addPayment();
                    }
                  }}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition"
                >
                  {editingItem ? 'Salva' : 'Aggiungi'}
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setEditingItem(null);
                    setNewPayment({
                      clientId: '',
                      customClientName: '',
                      amount: '',
                      deadline: '',
                      assignedTo: partners[0],
                      description: '',
                      paid: false,
                      partialPayments: []
                    });
                  }}
                  className="px-5 bg-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-400 transition"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETTAGLI PAGAMENTO - MODIFICATO: Più compatto e con modifica pagamenti parziali */}
      {showPaymentDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-amber-800">Dettagli</h3>
                <p className="text-sm text-gray-600 mt-1">{getClientName(selectedPayment)}</p>
              </div>
              <button
                onClick={() => {
                  setShowPaymentDetailModal(false);
                  setSelectedPayment(null);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Totale</div>
                  <div className="text-xl font-bold text-amber-700">€ {parseFloat(selectedPayment.amount).toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Responsabile</div>
                  <div className="text-lg font-bold text-gray-800">{selectedPayment.assignedTo}</div>
                </div>
              </div>

              {selectedPayment.deadline && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Scadenza</div>
                  <div className="text-sm font-semibold text-gray-800">{formatDate(selectedPayment.deadline)}</div>
                </div>
              )}

              {selectedPayment.description && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1 font-semibold">Descrizione</div>
                  <p className="text-sm text-gray-800">{selectedPayment.description}</p>
                </div>
              )}

              {selectedPayment.partialPayments && selectedPayment.partialPayments.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-yellow-800 mb-2">Pagamenti Parziali</div>
                  <div className="space-y-2">
                    {selectedPayment.partialPayments.map(pp => (
                      <div key={pp.id}>
                        {editingPartialPayment?.id === pp.id ? (
                          <div className="bg-white rounded p-2 space-y-2">
                            <input
                              type="number"
                              defaultValue={pp.amount}
                              onChange={(e) => setEditingPartialPayment({ ...editingPartialPayment, amount: e.target.value })}
                              className="w-full px-2 py-1 text-sm border rounded"
                              placeholder="Importo"
                            />
                            <input
                              type="text"
                              defaultValue={pp.note}
                              onChange={(e) => setEditingPartialPayment({ ...editingPartialPayment, note: e.target.value })}
                              className="w-full px-2 py-1 text-sm border rounded"
                              placeholder="Note"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => updatePartialPayment(pp.id, editingPartialPayment.amount, editingPartialPayment.note)}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                              >
                                Salva
                              </button>
                              <button
                                onClick={() => setEditingPartialPayment(null)}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                              >
                                Annulla
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center bg-white rounded p-2">
                            <div className="flex-1">
                              <div className="font-semibold text-sm">€ {pp.amount.toFixed(2)}</div>
                              {pp.note && <div className="text-xs text-gray-600">{pp.note}</div>}
                              <div className="text-xs text-gray-500">{formatDate(pp.date.split('T')[0])}</div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingPartialPayment({ id: pp.id, amount: pp.amount, note: pp.note })}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => deletePartialPayment(pp.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-yellow-200 text-sm font-bold flex justify-between">
                    <span>Rimanente:</span>
                    <span className="text-yellow-700">€ {getRemainingAmount(selectedPayment).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {!selectedPayment.paid && (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    placeholder="Importo parziale..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    value={partialNote}
                    onChange={(e) => setPartialNote(e.target.value)}
                    placeholder="Note (opzionale)..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={addPartialPayment}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
                  >
                    Aggiungi Parziale
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL GIORNO CALENDARIO */}
      {showDayPaymentsModal && selectedCalendarDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-amber-800">Pagamenti</h3>
                <p className="text-gray-600 mt-1">{formatDate(selectedCalendarDay.date)}</p>
              </div>
              <button
                onClick={() => {
                  setShowDayPaymentsModal(false);
                  setSelectedCalendarDay(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {selectedCalendarDay.payments.map(payment => (
                <div
                  key={payment.id}
                  className={`border-2 rounded-lg p-4 ${
                    payment.paid ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{getClientName(payment)}</h4>
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <div className="font-bold text-amber-700">€ {parseFloat(payment.amount).toFixed(2)}</div>
                        <div>Responsabile: {payment.assignedTo}</div>
                        {payment.paid && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                            Pagato
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL STORICO CLIENTE */}
      {showClientHistoryModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 my-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-amber-800">Storico Pagamenti</h3>
                <p className="text-gray-600 mt-1">{selectedClient.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowClientHistoryModal(false);
                  setSelectedClient(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getClientPaymentHistory(selectedClient.id).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Nessun pagamento trovato</p>
                </div>
              ) : (
                getClientPaymentHistory(selectedClient.id).map(payment => (
                  <div
                    key={payment.id}
                    className={`border-2 rounded-lg p-4 ${
                      payment.paid ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-lg text-amber-700">€ {parseFloat(payment.amount).toFixed(2)}</span>
                          {payment.paid && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                              Pagato
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {payment.deadline && (
                            <div>📅 Scadenza: {formatDate(payment.deadline)}</div>
                          )}
                          <div>👤 Responsabile: {payment.assignedTo}</div>
                          {payment.description && (
                            <div className="mt-2 text-gray-700">{payment.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TASK */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              {editingItem ? 'Modifica Task' : 'Nuova Task'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Titolo *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Titolo task..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows="3"
                  placeholder="Descrizione..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Scadenza</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {activePartner === 'Tutti' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assegnata a</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Tutti">Tutti</option>
                    {partners.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (editingItem) {
                      updateTask();
                    } else {
                      addTask();
                    }
                  }}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  {editingItem ? 'Salva' : 'Aggiungi'}
                </button>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingItem(null);
                    setNewTask({
                      title: '',
                      description: '',
                      deadline: '',
                      assignedTo: 'Tutti',
                      completed: false
                    });
                  }}
                  className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SHOPPING */}
      {showShoppingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">Nuovo Articolo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Articolo *</label>
                <input
                  type="text"
                  value={newShoppingItem.item}
                  onChange={(e) => setNewShoppingItem({ ...newShoppingItem, item: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Es. Caffè, carta..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addShoppingItem}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  Aggiungi
                </button>
                <button
                  onClick={() => {
                    setShowShoppingModal(false);
                    setNewShoppingItem({
                      item: '',
                      completed: false
                    });
                  }}
                  className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeehindStudioPlatform;
