import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Target, TrendingUp, Flame, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { focusMode } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, habitsRes, expensesRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/habits`),
        axios.get(`${API}/expenses`)
      ]);
      setStats(statsRes.data);
      setHabits(habitsRes.data);
      setExpenses(expensesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

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

  const todayExpenses = expenses.filter(e => e.date === new Date().toISOString().split('T')[0]);
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen">
      {!focusMode && <Navbar />}
      <div className="noise-overlay" />
      
      <div className="px-6 md:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-2">Dashboard</h1>
          <p className="font-body text-muted-foreground text-lg">Your progress at a glance</p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Habits */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 hover:shadow-lg transition-all"
            data-testid="total-habits-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Habits</span>
            </div>
            <div className="font-heading font-bold text-5xl tracking-tighter">{stats?.total_habits || 0}</div>
            <p className="text-muted-foreground text-sm mt-2">Active habits</p>
          </motion.div>

          {/* Max Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 hover:shadow-lg transition-all"
            data-testid="max-streak-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-secondary" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Best Streak</span>
            </div>
            <div className="font-heading font-bold text-5xl tracking-tighter">{stats?.max_streak || 0}</div>
            <p className="text-muted-foreground text-sm mt-2">Days in a row</p>
          </motion.div>

          {/* Total Expenses */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 hover:shadow-lg transition-all"
            data-testid="total-expenses-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Expenses</span>
            </div>
            <div className="font-heading font-bold text-5xl tracking-tighter">
              ₹{Math.round(stats?.total_expenses || 0)}
            </div>
            <p className="text-muted-foreground text-sm mt-2">Total spent</p>
          </motion.div>

          {/* Today's Spending */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 hover:shadow-lg transition-all"
            data-testid="today-spending-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Today</span>
            </div>
            <div className="font-heading font-bold text-5xl tracking-tighter">
              ₹{Math.round(todayTotal)}
            </div>
            <p className="text-muted-foreground text-sm mt-2">Today's expenses</p>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Habits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8"
            data-testid="recent-habits-card"
          >
            <h3 className="font-heading font-semibold text-2xl mb-6">Recent Habits</h3>
            {habits.length > 0 ? (
              <div className="space-y-4">
                {habits.slice(0, 4).map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full" style={{ backgroundColor: habit.color + '20' }}>
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          {habit.icon === 'target' && <Target className="w-5 h-5" style={{ color: habit.color }} />}
                          {habit.icon === 'flame' && <Flame className="w-5 h-5" style={{ color: habit.color }} />}
                        </div>
                      </div>
                      <div>
                        <div className="font-heading font-medium">{habit.name}</div>
                        <div className="text-sm text-muted-foreground">{habit.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-secondary" />
                      <span className="font-heading font-bold">{habit.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No habits yet. Create your first habit!</p>
            )}
          </motion.div>

          {/* Recent Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8"
            data-testid="recent-expenses-card"
          >
            <h3 className="font-heading font-semibold text-2xl mb-6">Recent Expenses</h3>
            {expenses.length > 0 ? (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-heading font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">{expense.category} • {expense.date}</div>
                    </div>
                    <div className="font-heading font-bold text-lg">₹{expense.amount}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No expenses yet. Add your first expense!</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;