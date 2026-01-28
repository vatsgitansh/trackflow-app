import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Sparkles, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <div className="noise-overlay" />
      
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1705302188426-2d8f8ba6552b?crop=entropy&cs=srgb&fm=jpg&q=85" 
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>
        
        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">Free Forever</span>
            </div>
            
            <h1 className="font-heading font-bold text-5xl md:text-7xl tracking-tight leading-none mb-6">
              Build Better Habits,
              <span className="block text-primary mt-2">Track Every Rupee</span>
            </h1>
            
            <p className="font-body text-lg md:text-xl leading-relaxed text-muted-foreground mb-12 max-w-2xl">
              Your daily companion for habit tracking and expense management. Build streaks, manage money, and transform your life—one day at a time.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 font-heading font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  data-testid="hero-get-started-btn"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-6 font-heading font-semibold"
                  data-testid="hero-login-btn"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-semibold text-3xl md:text-5xl tracking-tight mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful tools to help you stay on track with your goals and finances.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Habit Tracking",
                description: "Build and maintain daily habits with streak counters and visual progress.",
                color: "text-primary"
              },
              {
                icon: TrendingUp,
                title: "Expense Manager",
                description: "Track every expense, categorize spending, and see where your money goes.",
                color: "text-secondary"
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Get insights on your habits and spending patterns with beautiful charts.",
                color: "text-accent"
              },
              {
                icon: Zap,
                title: "Focus Mode",
                description: "Distraction-free interface for quick habit logging and expense entry.",
                color: "text-primary"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data is encrypted and stored securely. We never share your information.",
                color: "text-secondary"
              },
              {
                icon: Sparkles,
                title: "Premium Features",
                description: "Unlock advanced analytics, unlimited storage, and ad-free experience.",
                color: "text-accent"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                data-testid={`feature-card-${index}`}
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
                <h3 className="font-heading font-medium text-2xl mb-3">{feature.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 p-12 md:p-16 text-center"
        >
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
            Start Your Journey Today
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are building better habits and managing their money smarter.
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="rounded-full px-10 py-6 font-heading font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              data-testid="cta-signup-btn"
            >
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;