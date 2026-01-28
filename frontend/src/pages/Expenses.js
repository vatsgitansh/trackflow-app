import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Plus, TrendingUp, Trash2, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'UPI'
  });
  const { focusMode } = useTheme();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (filterCategory === 'All') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(e => e.category === filterCategory));
    }
  }, [filterCategory, expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API}/expenses`);
      setExpenses(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async () => {
    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await axios.post(`${API}/expenses`, { ...newExpense, amount: parseFloat(newExpense.amount) });
      toast.success('Expense added!');
      setDialogOpen(false);
      setNewExpense({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'UPI'
      });
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await axios.delete(`${API}/expenses/${expenseId}`);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!focusMode && <Navbar />}
      <div className="noise-overlay" />
      
      <div className="px-6 md:px-12 py-12">
        <div className="flex items-center justify-between mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-2">Expenses</h1>
            <p className="font-body text-muted-foreground text-lg">Track every rupee</p>
          </motion.div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6" data-testid="add-expense-btn">
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl" data-testid="add-expense-dialog">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Amount (₹)</Label>
                  <Input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="500"
                    className="rounded-2xl h-12 mt-2"
                    data-testid="expense-amount-input"
                  />
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Description</Label>
                  <Input
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Lunch at restaurant"
                    className="rounded-2xl h-12 mt-2"
                    data-testid="expense-description-input"
                  />
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Category</Label>
                  <Select value={newExpense.category} onValueChange={(val) => setNewExpense({ ...newExpense, category: val })}>
                    <SelectTrigger className="rounded-2xl h-12 mt-2" data-testid="expense-category-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Bills">Bills</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Date</Label>
                  <Input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="rounded-2xl h-12 mt-2"
                    data-testid="expense-date-input"
                  />
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Payment Method</Label>
                  <Select value={newExpense.payment_method} onValueChange={(val) => setNewExpense({ ...newExpense, payment_method: val })}>
                    <SelectTrigger className="rounded-2xl h-12 mt-2" data-testid="expense-payment-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Net Banking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={createExpense} className="w-full rounded-full h-12" data-testid="create-expense-submit-btn">
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8"
            data-testid="total-spent-card"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total Spent</span>
            <div className="font-heading font-bold text-4xl tracking-tighter mt-2">₹{Math.round(totalExpenses)}</div>
          </motion.div>

          {Object.entries(categoryTotals).slice(0, 3).map(([category, amount], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index + 1) * 0.1 }}
              className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8"
              data-testid={`category-${category}-card`}
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{category}</span>
              <div className="font-heading font-bold text-4xl tracking-tighter mt-2">₹{Math.round(amount)}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="rounded-full w-48" data-testid="filter-category-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Bills">Bills</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length > 0 ? (
          <div className="space-y-4">
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 hover:shadow-lg transition-all group"
                data-testid={`expense-item-${index}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-lg">{expense.description}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>{expense.date}</span>
                        <span>•</span>
                        <span>{expense.payment_method}</span>
                      </div>
                    </div>
                    <div className="font-heading font-bold text-2xl">₹{expense.amount}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                      data-testid={`delete-expense-${index}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-16 text-center"
          >
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-heading font-semibold text-2xl mb-2">No expenses yet</h3>
            <p className="text-muted-foreground mb-8">Start tracking your expenses today!</p>
            <Button onClick={() => setDialogOpen(true)} className="rounded-full px-8" data-testid="empty-add-expense-btn">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Expense
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Expenses;