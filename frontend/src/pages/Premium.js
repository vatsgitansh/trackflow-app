import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, BarChart3, Download, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Premium = () => {
  const { user } = useAuth();
  const { focusMode } = useTheme();

  const features = [
    { icon: Zap, title: 'Ad-Free Experience', description: 'Enjoy distraction-free tracking without any ads' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Deep insights with charts, trends, and predictions' },
    { icon: Download, title: 'Export Data', description: 'Download your data as PDF or Excel anytime' },
    { icon: Shield, title: 'Priority Support', description: 'Get help faster with dedicated support' },
    { icon: Sparkles, title: 'Unlimited Storage', description: 'No limits on habits or expenses tracking' },
    { icon: Crown, title: 'Custom Themes', description: 'Personalize your experience with exclusive themes' }
  ];

  return (
    <div className="min-h-screen">
      {!focusMode && <Navbar />}
      <div className="noise-overlay" />
      
      <div className="px-6 md:px-12 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Crown className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">Premium</span>
          </div>
          
          <h1 className="font-heading font-bold text-5xl md:text-7xl tracking-tight leading-none mb-6">
            Unlock Your Full
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2">
              Potential
            </span>
          </h1>
          
          <p className="font-body text-lg md:text-xl leading-relaxed text-muted-foreground mb-8">
            Take your habit tracking and expense management to the next level with premium features designed for serious achievers.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="rounded-3xl border border-primary/50 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-xl p-12 text-center relative overflow-hidden"
               data-testid="premium-pricing-card">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="font-heading font-bold text-6xl tracking-tighter mb-2">
                ₹499<span className="text-2xl text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-8">or ₹4,999/year (save 17%)</p>
              
              <Button 
                size="lg" 
                className="rounded-full px-12 py-6 font-heading font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                disabled
                data-testid="upgrade-premium-btn"
              >
                Coming Soon
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Payment integration in progress. Stay tuned!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-heading font-semibold text-3xl md:text-4xl text-center mb-12"
          >
            What You'll Get
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 hover:border-primary/30 hover:shadow-lg transition-all"
                data-testid={`premium-feature-${index}`}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mt-16 text-center rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-12"
        >
          <h3 className="font-heading font-bold text-3xl mb-4">Start Your Free Trial</h3>
          <p className="text-muted-foreground mb-8">
            Try premium features free for 14 days. No credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5 text-secondary" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5 text-secondary" />
              <span>No commitments</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-5 h-5 text-secondary" />
              <span>Full access</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;