import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Edit2, Plus, Users, DollarSign, Receipt, Check, X } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const BeehindStudioPlatform = () => {
  const partners = ['Giorgina', 'Simo', 'Edom', 'Mino', 'Edob'];
  
  const partnerColors = {
    'Giorgina': {
      bg: 'bg-pink-100',
      border: 'border-pink-400',
      button: 'bg-pink-500',
      buttonHover: 'hover:bg-pink-600',
      buttonLight: 'bg-pink-100',
      buttonLightHover: 'hover:bg-pink-200',
      text: 'text-pink-800',
      dark: 'bg-pink-600'
    },
    'Simo': {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      button: 'bg-blue-500',
      buttonHover: 'hover:bg-blue-600',
      buttonLight: 'bg-blue-100',
      buttonLightHover: 'hover:bg-blue-200',
      text: 'text-blue-800',
      dark: 'bg-blue-600'
    },
    'Edom': {
      bg: 'bg-purple-100',
      border: 'border-purple-400',
      button: 'bg-purple-500',
      buttonHover: 'hover:bg-purple-600',
      buttonLight: 'bg-purple-100',
      buttonLightHover: 'hover:bg-purple-200',
      text: 'text-purple-800',
      dark: 'bg-purple-600'
    },
    'Mino': {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      button: 'bg-yellow-500',
      buttonHover: 'hover:bg-yellow-600',
      buttonLight: 'bg-yellow-100',
      buttonLightHover: 'hover:bg-yellow-200',
      text: 'text-yellow-800',
      dark: 'bg-yellow-600'
    },
    'Edob': {
      bg: 'bg-green-100',
      border: 'border-green-400',
      button: 'bg-green-500',
      buttonHover: 'hover:bg-green-600',
      buttonLight: 'bg-green-100',
      buttonLightHover: 'hover:bg-green-200',
      text: 'text-green-800',
      dark: 'bg-green-600'
    }
  };
  
  const [activeSection, setActiveSection] = useState('Beehind Studio');
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(null);

  // Carica dati da Firebase all'avvio
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carica tasks
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        const loadedTasks = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(loadedTasks);

        // Carica payments
        const paymentsSnapshot = await getDocs(collection(db, 'payments'));
        const loadedPayments = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPayments(loadedPayments);

        // Carica expenses
        const expensesSnapshot = await getDocs(collection(db, 'expenses'));
        const loadedExpenses = expensesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExpenses(loadedExpenses);
        
        console.log('✅ Dati caricati da Firebase!');
      } catch (error) {
        console.error('❌ Errore nel caricamento:', error);
      }
    };
    loadData();
  }, []);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: 'Tutti',
    type: 'task',
    completed: false
  });

  const [newPayment, setNewPayment] = useState({
    client: '',
    amount: '',
    deadline: '',
    assignedTo: partners[0],
    type: 'payment',
    paid: false
  });

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    deadline: '',
    type: 'expense'
  });

  const sortByDeadline = (items) => {
    return [...items].sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  };

  const getFilteredTasks = () => {
    if (activeSection === 'Beehind Studio') {
      return sortByDeadline(tasks.filter(task => task.assignedTo === 'Tutti'));
    }
    return sortByDeadline(tasks.filter(task => task.assignedTo === activeSection));
  };

  const getFilteredPayments = () => {
    if (activeSection === 'Beehind Studio') {
      return sortByDeadline(payments);
    }
    return sortByDeadline(payments.filter(payment => payment.assignedTo === activeSection));
  };

  const getFilteredExpenses = () => {
    return sortByDeadline(expenses);
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const task = {
        ...newTask,
        assignedTo: activeSection !== 'Beehind Studio' ? activeSection : newTask.assignedTo,
        createdAt: new Date().toISOString()
      };
      
      // Salva su Firebase
      const docRef = await addDoc(collection(db, 'tasks'), task);
      
      // Aggiungi alla lista locale con l'ID di Firebase
      setTasks([...tasks, { ...task, id: docRef.id }]);
      
      setNewTask({ title: '', description: '', deadline: '', assignedTo: 'Tutti', type: 'task', completed: false });
      setShowTaskModal(false);
      
      console.log('✅ Task aggiunta con ID:', docRef.id);
    } catch (error) {
      console.error('❌ Errore nell\'aggiungere task:', error);
      alert('Errore nel salvare la task. Controlla la console per dettagli.');
    }
  };

  const addPayment = async () => {
    if (!newPayment.client.trim() || !newPayment.amount) return;
    
    try {
      const payment = {
        ...newPayment,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'payments'), payment);
      setPayments([...payments, { ...payment, id: docRef.id }]);
      
      setNewPayment({ client: '', amount: '', deadline: '', assignedTo: partners[0], type: 'payment', paid: false });
      setShowPaymentModal(false);
      
      console.log('✅ Pagamento aggiunto con ID:', docRef.id);
    } catch (error) {
      console.error('❌ Errore nell\'aggiungere pagamento:', error);
      alert('Errore nel salvare il pagamento. Controlla la console per dettagli.');
    }
  };

  const addExpense = async () => {
    if (!newExpense.description.trim() || !newExpense.amount) return;
    
    try {
      const expense = {
        ...newExpense,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'expenses'), expense);
      setExpenses([...expenses, { ...expense, id: docRef.id }]);
      
      setNewExpense({ description: '', amount: '', deadline: '', type: 'expense' });
      setShowExpenseModal(false);
      
      console.log('✅ Spesa aggiunta con ID:', docRef.id);
    } catch (error) {
      console.error('❌ Errore nell\'aggiungere spesa:', error);
      alert('Errore nel salvare la spesa. Controlla la console per dettagli.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      setTasks(tasks.filter(task => task.id !== id));
      console.log('✅ Task eliminata');
    } catch (error) {
      console.error('❌ Errore nell\'eliminare task:', error);
      alert('Errore nell\'eliminare la task. Riprova.');
    }
  };

  const deletePayment = async (id) => {
    try {
      await deleteDoc(doc(db, 'payments', id));
      setPayments(payments.filter(payment => payment.id !== id));
      console.log('✅ Pagamento eliminato');
    } catch (error) {
      console.error('❌ Errore nell\'eliminare pagamento:', error);
      alert('Errore nell\'eliminare il pagamento. Riprova.');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      setExpenses(expenses.filter(expense => expense.id !== id));
      console.log('✅ Spesa eliminata');
    } catch (error) {
      console.error('❌ Errore nell\'eliminare spesa:', error);
      alert('Errore nell\'eliminare la spesa. Riprova.');
    }
  };

  const startEdit = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    if (type === 'task') {
      setNewTask(item);
      setShowTaskModal(true);
    } else if (type === 'payment') {
      setNewPayment(item);
      setShowPaymentModal(true);
    } else if (type === 'expense') {
      setNewExpense(item);
      setShowExpenseModal(true);
    }
  };

  const saveEdit = async () => {
    try {
      if (editType === 'task') {
        const updatedTask = { 
          ...newTask, 
          id: editingItem.id, 
          createdAt: editingItem.createdAt, 
          completed: editingItem.completed 
        };
        
        await updateDoc(doc(db, 'tasks', editingItem.id), updatedTask);
        setTasks(tasks.map(task => task.id === editingItem.id ? updatedTask : task));
        
        setNewTask({ title: '', description: '', deadline: '', assignedTo: 'Tutti', type: 'task', completed: false });
        setShowTaskModal(false);
        console.log('✅ Task aggiornata');
        
      } else if (editType === 'payment') {
        const updatedPayment = { 
          ...newPayment, 
          id: editingItem.id, 
          createdAt: editingItem.createdAt,
          paid: editingItem.paid
        };
        
        await updateDoc(doc(db, 'payments', editingItem.id), updatedPayment);
        setPayments(payments.map(payment => payment.id === editingItem.id ? updatedPayment : payment));
        
        setNewPayment({ client: '', amount: '', deadline: '', assignedTo: partners[0], type: 'payment', paid: false });
        setShowPaymentModal(false);
        console.log('✅ Pagamento aggiornato');
        
      } else if (editType === 'expense') {
        const updatedExpense = { 
          ...newExpense, 
          id: editingItem.id, 
          createdAt: editingItem.createdAt 
        };
        
        await updateDoc(doc(db, 'expenses', editingItem.id), updatedExpense);
        setExpenses(expenses.map(expense => expense.id === editingItem.id ? updatedExpense : expense));
        
        setNewExpense({ description: '', amount: '', deadline: '', type: 'expense' });
        setShowExpenseModal(false);
        console.log('✅ Spesa aggiornata');
      }
      
      setEditingItem(null);
      setEditType(null);
    } catch (error) {
      console.error('❌ Errore nell\'aggiornare:', error);
      alert('Errore nell\'aggiornare. Riprova.');
    }
  };

  const togglePaymentStatus = async (id) => {
    try {
      const payment = payments.find(p => p.id === id);
      const newStatus = !payment.paid;
      
      await updateDoc(doc(db, 'payments', id), {
        paid: newStatus
      });
      
      setPayments(payments.map(payment => 
        payment.id === id ? { ...payment, paid: newStatus } : payment
      ));
      
      console.log('✅ Status pagamento aggiornato');
    } catch (error) {
      console.error('❌ Errore nell\'aggiornare status pagamento:', error);
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      const newStatus = !task.completed;
      
      await updateDoc(doc(db, 'tasks', id), {
        completed: newStatus
      });
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: newStatus } : task
      ));
      
      console.log('✅ Status task aggiornato');
    } catch (error) {
      console.error('❌ Errore nell\'aggiornare status task:', error);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-amber-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8" />
            Beehind Studio - Gestione Task
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection('Beehind Studio')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeSection === 'Beehind Studio'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
            >
              Beehind Studio
            </button>
            {partners.map(partner => (
              <button
                key={partner}
                onClick={() => setActiveSection(partner)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeSection === partner
                    ? `${partnerColors[partner].dark} text-white shadow-md`
                    : `${partnerColors[partner].buttonLight} ${partnerColors[partner].text} ${partnerColors[partner].buttonLightHover}`
                }`}
              >
                {partner}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tasks Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-800 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Task
              </h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditType(null);
                  setNewTask({ title: '', description: '', deadline: '', assignedTo: 'Tutti', type: 'task', completed: false });
                  setShowTaskModal(true);
                }}
                className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getFilteredTasks().length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nessuna task</p>
              ) : (
                getFilteredTasks().map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      task.completed 
                        ? 'bg-green-50 border-green-300' 
                        : isOverdue(task.deadline)
                        ? 'bg-red-50 border-red-300'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                              task.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-amber-500'
                            }`}
                          >
                            {task.completed && <Check className="w-4 h-4 text-white" />}
                          </button>
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-amber-900'}`}>
                            {task.title}
                          </h3>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1 ml-8">{task.description}</p>
                        )}
                        {task.deadline && (
                          <div className={`text-sm mt-2 ml-8 flex items-center gap-1 ${
                            isOverdue(task.deadline) && !task.completed ? 'text-red-600 font-semibold' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.deadline)}
                          </div>
                        )}
                        {task.assignedTo && task.assignedTo !== 'Tutti' && (
                          <div className="text-xs mt-2 ml-8">
                            <span className={`inline-block px-2 py-1 rounded ${partnerColors[task.assignedTo].bg} ${partnerColors[task.assignedTo].text}`}>
                              {task.assignedTo}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(task, 'task')}
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payments Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Pagamenti Clienti
              </h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditType(null);
                  setNewPayment({ client: '', amount: '', deadline: '', assignedTo: partners[0], type: 'payment', paid: false });
                  setShowPaymentModal(true);
                }}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getFilteredPayments().length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nessun pagamento</p>
              ) : (
                getFilteredPayments().map(payment => (
                  <div
                    key={payment.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      payment.paid 
                        ? 'bg-green-50 border-green-300' 
                        : isOverdue(payment.deadline)
                        ? 'bg-red-50 border-red-300'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePaymentStatus(payment.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                              payment.paid
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {payment.paid && <Check className="w-4 h-4 text-white" />}
                          </button>
                          <h3 className={`font-semibold ${payment.paid ? 'line-through text-gray-500' : 'text-blue-900'}`}>
                            {payment.client}
                          </h3>
                        </div>
                        <p className="text-lg font-bold text-green-700 mt-1 ml-8">€ {payment.amount}</p>
                        {payment.deadline && (
                          <div className={`text-sm mt-1 ml-8 flex items-center gap-1 ${
                            isOverdue(payment.deadline) && !payment.paid ? 'text-red-600 font-semibold' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {formatDate(payment.deadline)}
                          </div>
                        )}
                        {payment.assignedTo && (
                          <div className="text-xs mt-2 ml-8">
                            <span className={`inline-block px-2 py-1 rounded ${partnerColors[payment.assignedTo].bg} ${partnerColors[payment.assignedTo].text}`}>
                              {payment.assignedTo}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(payment, 'payment')}
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePayment(payment.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Expenses Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">
                <Receipt className="w-6 h-6" />
                Spese Ufficio
              </h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditType(null);
                  setNewExpense({ description: '', amount: '', deadline: '', type: 'expense' });
                  setShowExpenseModal(true);
                }}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getFilteredExpenses().length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nessuna spesa</p>
              ) : (
                getFilteredExpenses().map(expense => (
                  <div
                    key={expense.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isOverdue(expense.deadline)
                        ? 'bg-red-100 border-red-300'
                        : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900">{expense.description}</h3>
                        <p className="text-lg font-bold text-red-700 mt-1">€ {expense.amount}</p>
                        {expense.deadline && (
                          <div className={`text-sm mt-1 flex items-center gap-1 ${
                            isOverdue(expense.deadline) ? 'text-red-600 font-semibold' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {formatDate(expense.deadline)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(expense, 'expense')}
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Titolo task..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              {activeSection === 'Beehind Studio' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assegnata a</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="Tutti">Tutti (Generale)</option>
                    {partners.map(partner => (
                      <option key={partner} value={partner}>{partner}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (editingItem) {
                      saveEdit();
                    } else {
                      addTask();
                    }
                  }}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  {editingItem ? 'Salva Modifiche' : 'Aggiungi Task'}
                </button>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingItem(null);
                    setEditType(null);
                    setNewTask({ title: '', description: '', deadline: '', assignedTo: 'Tutti', type: 'task', completed: false });
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              {editingItem ? 'Modifica Pagamento' : 'Nuovo Pagamento Cliente'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente *</label>
                <input
                  type="text"
                  value={newPayment.client}
                  onChange={(e) => setNewPayment({ ...newPayment, client: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nome cliente..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Importo (€) *</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Scadenza</label>
                <input
                  type="date"
                  value={newPayment.deadline}
                  onChange={(e) => setNewPayment({ ...newPayment, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Responsabile *</label>
                <select
                  value={newPayment.assignedTo}
                  onChange={(e) => setNewPayment({ ...newPayment, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {partners.map(partner => (
                    <option key={partner} value={partner}>{partner}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (editingItem) {
                      saveEdit();
                    } else {
                      addPayment();
                    }
                  }}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  {editingItem ? 'Salva Modifiche' : 'Aggiungi Pagamento'}
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setEditingItem(null);
                    setEditType(null);
                    setNewPayment({ client: '', amount: '', deadline: '', assignedTo: partners[0], type: 'payment', paid: false });
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

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">
              {editingItem ? 'Modifica Spesa' : 'Nuova Spesa Ufficio'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrizione *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descrizione spesa..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Importo (€) *</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Scadenza</label>
                <input
                  type="date"
                  value={newExpense.deadline}
                  onChange={(e) => setNewExpense({ ...newExpense, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (editingItem) {
                      saveEdit();
                    } else {
                      addExpense();
                    }
                  }}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
                >
                  {editingItem ? 'Salva Modifiche' : 'Aggiungi Spesa'}
                </button>
                <button
                  onClick={() => {
                    setShowExpenseModal(false);
                    setEditingItem(null);
                    setEditType(null);
                    setNewExpense({ description: '', amount: '', deadline: '', type: 'expense' });
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
