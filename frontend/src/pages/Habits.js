import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Plus, Flame, Target, Check, Trash2 } from 'lucide-react';
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

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'Health', color: '#4F46E5', icon: 'target' });
  const { focusMode } = useTheme();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`${API}/habits`);
      setHabits(response.data);
    } catch (error) {
      console.error('Failed to fetch habits', error);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async () => {
    try {
      await axios.post(`${API}/habits`, newHabit);
      toast.success('Habit created!');
      setDialogOpen(false);
      setNewHabit({ name: '', category: 'Health', color: '#4F46E5', icon: 'target' });
      fetchHabits();
    } catch (error) {
      toast.error('Failed to create habit');
    }
  };

  const completeHabit = async (habitId) => {
    try {
      const today = new Date().toISOString();
      await axios.post(`${API}/habits/${habitId}/complete`, { date: today });
      toast.success('Great job!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      fetchHabits();
    } catch (error) {
      toast.error('Failed to complete habit');
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await axios.delete(`${API}/habits/${habitId}`);
      toast.success('Habit deleted');
      fetchHabits();
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completions.some(date => date.startsWith(today));
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

  return (
    <div className="min-h-screen">
      {!focusMode && <Navbar />}
      <div className="noise-overlay" />
      
      <div className="px-6 md:px-12 py-12">
        <div className="flex items-center justify-between mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-2">Habits</h1>
            <p className="font-body text-muted-foreground text-lg">Build streaks, build yourself</p>
          </motion.div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6" data-testid="add-habit-btn">
                <Plus className="w-5 h-5 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl" data-testid="add-habit-dialog">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Habit Name</Label>
                  <Input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="Morning meditation"
                    className="rounded-2xl h-12 mt-2"
                    data-testid="habit-name-input"
                  />
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Category</Label>
                  <Select value={newHabit.category} onValueChange={(val) => setNewHabit({ ...newHabit, category: val })}>
                    <SelectTrigger className="rounded-2xl h-12 mt-2" data-testid="habit-category-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Learning">Learning</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest">Color</Label>
                  <div className="flex gap-3 mt-2">
                    {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map(color => (
                      <button
                        key={color}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                          newHabit.color === color ? 'ring-4 ring-primary/50 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        data-testid={`color-${color}`}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={createHabit} className="w-full rounded-full h-12" data-testid="create-habit-submit-btn">
                  Create Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Habits Grid */}
        {habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit, index) => {
              const completed = isCompletedToday(habit);
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-3xl border backdrop-blur-xl p-8 hover:shadow-lg transition-all group relative ${
                    completed ? 'border-secondary/50 bg-secondary/5' : 'border-border/50 bg-card/50'
                  }`}
                  data-testid={`habit-card-${index}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: habit.color + '20' }}
                    >
                      <Target className="w-8 h-8" style={{ color: habit.color }} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                      data-testid={`delete-habit-${index}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  <h3 className="font-heading font-semibold text-2xl mb-2">{habit.name}</h3>
                  <p className="text-muted-foreground mb-6">{habit.category}</p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-secondary" />
                      <span className="font-heading font-bold text-2xl">{habit.streak}</span>
                      <span className="text-muted-foreground text-sm">day streak</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => completeHabit(habit.id)}
                    disabled={completed}
                    className={`w-full rounded-full h-12 font-heading font-semibold ${
                      completed ? 'bg-secondary hover:bg-secondary' : ''
                    }`}
                    data-testid={`complete-habit-${index}`}
                  >
                    {completed ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Completed Today
                      </>
                    ) : (
                      'Complete Today'
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-16 text-center"
          >
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-heading font-semibold text-2xl mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-8">Create your first habit and start building streaks!</p>
            <Button onClick={() => setDialogOpen(true)} className="rounded-full px-8" data-testid="empty-add-habit-btn">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Habit
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Habits;