import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Edit2, Plus, Users, DollarSign, Receipt, Check, X } from 'lucide-react';

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

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksData = await window.storage.get('beehind-tasks');
        const paymentsData = await window.storage.get('beehind-payments');
        const expensesData = await window.storage.get('beehind-expenses');
        
        if (tasksData) setTasks(JSON.parse(tasksData.value));
        if (paymentsData) setPayments(JSON.parse(paymentsData.value));
        if (expensesData) setExpenses(JSON.parse(expensesData.value));
      } catch (error) {
        console.log('No existing data, starting fresh');
      }
    };
    loadData();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await window.storage.set('beehind-tasks', JSON.stringify(tasks));
        await window.storage.set('beehind-payments', JSON.stringify(payments));
        await window.storage.set('beehind-expenses', JSON.stringify(expenses));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    if (tasks.length > 0 || payments.length > 0 || expenses.length > 0) {
      saveData();
    }
  }, [tasks, payments, expenses]);

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
      // In sezione generale mostra solo task "Tutti"
      return sortByDeadline(tasks.filter(task => task.assignedTo === 'Tutti'));
    }
    // Nelle sezioni personali mostra solo task assegnate a quel socio
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

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      ...newTask,
      // Se siamo nella sezione di un socio, assegna automaticamente a quel socio
      assignedTo: activeSection !== 'Beehind Studio' ? activeSection : newTask.assignedTo,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', deadline: '', assignedTo: 'Tutti', type: 'task', completed: false });
    setShowTaskModal(false);
  };

  const addPayment = () => {
    if (!newPayment.client.trim() || !newPayment.amount) return;
    
    const payment = {
      ...newPayment,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setPayments([...payments, payment]);
    setNewPayment({ client: '', amount: '', deadline: '', assignedTo: partners[0], type: 'payment', paid: false });
    setShowPaymentModal(false);
  };

  const addExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount) return;
    
    const expense = {
      ...newExpense,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setExpenses([...expenses, expense]);
    setNewExpense({ description: '', amount: '', deadline: '', type: 'expense' });
    setShowExpenseModal(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const deletePayment = (id) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
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

  const saveEdit = () => {
    if (editType === 'task') {
      setTasks(tasks.map(task => task.id === editingItem.id ? { ...newTask, id: task.id, createdAt: task.createdAt, completed: task.completed } : task));
      setNewTask({ title: '', description: '', deadline: '', assignedTo: 'Tutti', type: 'task', completed: false });
      setShowTaskModal(false);
    } else if (editType === 'payment') {
      setPayments(payments.map(payment => payment.id === editingItem.id ? { ...newPayment, id: payment.id, createdAt: payment.createdAt } : payment));
      setNewPayment({ client: '', amount: '', deadline: '', assignedTo: partners[0], type: 'payment', paid: false });
      setShowPaymentModal(false);
    } else if (editType === 'expense') {
      setExpenses(expenses.map(expense => expense.id === editingItem.id ? { ...newExpense, id: expense.id, createdAt: expense.createdAt } : expense));
      setNewExpense({ description: '', amount: '', deadline: '', type: 'expense' });
      setShowExpenseModal(false);
    }
    setEditingItem(null);
    setEditType(null);
  };

  const togglePaymentStatus = (id) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, paid: !payment.paid } : payment
    ));
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-800">Task</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditType(null);
                  setShowTaskModal(true);
                }}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition"
              >
                <Plus className="w-5 h-5" />
                Nuova Task
              </button>
            </div>

            <div className="space-y-3">
              {getFilteredTasks().map(task => {
                const taskColor = task.assignedTo !== 'Tutti' && partnerColors[task.assignedTo] 
                  ? partnerColors[task.assignedTo] 
                  : { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700' };
                
                return (
                  <div
                    key={task.id}
                    className={`border-l-4 p-4 rounded-lg shadow-sm ${
                      task.completed 
                        ? 'border-green-500 bg-green-50 opacity-75'
                        : isOverdue(task.deadline) 
                        ? 'border-red-500 bg-red-50' 
                        : `${taskColor.border} ${taskColor.bg}`
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-lg text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex gap-4 mt-2 text-sm">
                            {task.deadline && (
                              <span className={`flex items-center gap-1 ${isOverdue(task.deadline) && !task.completed ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                <Calendar className="w-4 h-4" />
                                {formatDate(task.deadline)}
                              </span>
                            )}
                            <span className={`font-medium ${taskColor.text}`}>
                              {task.assignedTo === 'Tutti' ? '👥 Tutti' : `👤 ${task.assignedTo}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(task, 'task')}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {getFilteredTasks().length === 0 && (
                <p className="text-gray-400 text-center py-8">Nessuna task presente</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payments Section */}
            {activeSection === 'Beehind Studio' || getFilteredPayments().length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    Pagamenti Clienti
                  </h2>
                  {activeSection === 'Beehind Studio' && (
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setEditType(null);
                        setShowPaymentModal(true);
                      }}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {getFilteredPayments().map(payment => {
                    const paymentColor = partnerColors[payment.assignedTo] || { bg: 'bg-blue-50', border: 'border-blue-400' };
                    
                    return (
                      <div
                        key={payment.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          payment.paid
                            ? 'border-green-500 bg-green-50'
                            : isOverdue(payment.deadline)
                            ? 'border-red-500 bg-red-50'
                            : `${paymentColor.border} ${paymentColor.bg}`
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-800 truncate">{payment.client}</h4>
                              {payment.paid && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-lg font-bold text-gray-900">€{payment.amount}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 text-xs">
                              {payment.deadline && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span className={isOverdue(payment.deadline) && !payment.paid ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                                    Scadenza: {formatDate(payment.deadline)}
                                  </span>
                                </div>
                              )}
                              {activeSection === 'Beehind Studio' && (
                                <span className="text-gray-600 flex items-center gap-1">
                                  <span className="font-medium">👤 {payment.assignedTo}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => togglePaymentStatus(payment.id)}
                              className={`p-1.5 rounded ${payment.paid ? 'text-gray-400 hover:text-gray-600' : 'text-green-600 hover:text-green-800'}`}
                              title={payment.paid ? 'Segna come non pagato' : 'Segna come pagato'}
                            >
                              {payment.paid ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => startEdit(payment, 'payment')}
                              className="text-blue-600 hover:text-blue-800 p-1.5"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deletePayment(payment.id)}
                              className="text-red-600 hover:text-red-800 p-1.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {getFilteredPayments().length === 0 && (
                    <p className="text-gray-400 text-center py-4 text-sm">Nessun pagamento</p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Expenses Section */}
            {activeSection === 'Beehind Studio' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                    <Receipt className="w-6 h-6" />
                    Spese Ufficio
                  </h2>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setEditType(null);
                      setShowExpenseModal(true);
                    }}
                    className="text-amber-600 hover:text-amber-800"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {getFilteredExpenses().map(expense => (
                    <div
                      key={expense.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        isOverdue(expense.deadline) ? 'border-red-500 bg-red-50' : 'border-purple-400 bg-purple-50'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 mb-1">{expense.description}</h4>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-lg font-bold text-purple-700">€{expense.amount}</span>
                          </div>
                          {expense.deadline && (
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className={isOverdue(expense.deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                                Scadenza: {formatDate(expense.deadline)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => startEdit(expense, 'expense')}
                            className="text-blue-600 hover:text-blue-800 p-1.5"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-800 p-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {getFilteredExpenses().length === 0 && (
                    <p className="text-gray-400 text-center py-4 text-sm">Nessuna spesa</p>
                  )}
                </div>
              </div>
            )}
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
                  placeholder="Titolo della task..."
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