import React from 'react';
import { motion } from 'framer-motion';
import { User, Moon, Sun, Zap, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, focusMode, toggleFocusMode } = useTheme();

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
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-2">Settings</h1>
          <p className="font-body text-muted-foreground text-lg">Manage your account and preferences</p>
        </motion.div>

        <div className="max-w-3xl">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 mb-6"
            data-testid="profile-section"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-2xl">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            {user?.is_premium && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Crown className="w-4 h-4 text-accent" />
                <span className="font-mono text-xs uppercase tracking-widest text-accent">Premium Member</span>
              </div>
            )}
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 mb-6"
            data-testid="appearance-section"
          >
            <h3 className="font-heading font-semibold text-xl mb-6">Appearance</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <Label className="font-heading font-medium text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} data-testid="dark-mode-switch" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Zap className="w-5 h-5" />
                  <div>
                    <Label className="font-heading font-medium text-base">Focus Mode</Label>
                    <p className="text-sm text-muted-foreground">Hide navigation for distraction-free experience</p>
                  </div>
                </div>
                <Switch checked={focusMode} onCheckedChange={toggleFocusMode} data-testid="focus-mode-switch" />
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8"
            data-testid="about-section"
          >
            <h3 className="font-heading font-semibold text-xl mb-4">About TrackFlow</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              TrackFlow helps you build better habits and track expenses with a beautiful, intuitive interface.
              Built for people who want to improve their lives, one day at a time.
            </p>
            <p className="text-sm text-muted-foreground">
              Version 1.0.0 • Made with ❤️
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;