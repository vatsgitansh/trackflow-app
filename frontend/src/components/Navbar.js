import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, LogOut, Settings, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/50 backdrop-blur-xl border-b border-border/50">
      <div className="px-6 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl">TrackFlow</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="rounded-full" data-testid="nav-dashboard-btn">
                  Dashboard
                </Button>
              </Link>
              <Link to="/habits">
                <Button variant="ghost" className="rounded-full" data-testid="nav-habits-btn">
                  Habits
                </Button>
              </Link>
              <Link to="/expenses">
                <Button variant="ghost" className="rounded-full" data-testid="nav-expenses-btn">
                  Expenses
                </Button>
              </Link>
              <Link to="/premium">
                <Button variant="ghost" className="rounded-full text-accent" data-testid="nav-premium-btn">
                  Premium
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleTheme}
                data-testid="theme-toggle-btn"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Link to="/settings">
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="nav-settings-btn">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleLogout}
                data-testid="logout-btn"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;