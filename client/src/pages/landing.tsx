import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dumbbell, 
  Apple,
  Heart,
  Rocket,
  Check,
  Play,
  Flame,
  Brain,
  ChartLine,
  Menu,
  X
} from "lucide-react";
import AuthModal from "@/components/modals/auth-modal";
import DemoModal from "@/components/modals/demo-modal";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleStartFree = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleLogin = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const handleDemo = () => {
    setDemoModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">
                NOVAIA
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection('accueil')}
                  className="text-white hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium"
                >
                  Accueil
                </button>
                <button 
                  onClick={() => scrollToSection('fonctionnalites')}
                  className="text-gray-300 hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium"
                >
                  Fonctionnalités
                </button>
                <button 
                  onClick={() => scrollToSection('tarifs')}
                  className="text-gray-300 hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium"
                >
                  Tarifs
                </button>
                <Button onClick={handleLogin} className="primary-button px-6 py-2 text-sm">
                  Connexion
                </Button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                onClick={() => scrollToSection('accueil')}
                className="text-white hover:text-primary block px-3 py-2 text-base font-medium w-full text-left"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection('fonctionnalites')}
                className="text-gray-300 hover:text-primary block px-3 py-2 text-base font-medium w-full text-left"
              >
                Fonctionnalités
              </button>
              <button 
                onClick={() => scrollToSection('tarifs')}
                className="text-gray-300 hover:text-primary block px-3 py-2 text-base font-medium w-full text-left"
              >
                Tarifs
              </button>
              <Button onClick={handleLogin} className="primary-button w-full text-left mt-2">
                Connexion
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Transformez votre
                <span className="gradient-text block">
                  vie
                </span>
                avec l'IA
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                NOVAIA révolutionne votre bien-être avec un coaching personnalisé par IA. 
                Fitness, nutrition, mental et productivité - tout en un.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button onClick={handleStartFree} className="primary-button px-8 py-4 text-lg">
                  <Rocket className="mr-2 h-5 w-5" />
                  Démarrer gratuitement
                </Button>
                <Button onClick={handleDemo} variant="outline" className="glass-button px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Voir la démo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-gray-400">Utilisateurs actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-gray-400">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-gray-400">Coaching IA</div>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              {/* Modern fitness dashboard mockup */}
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern fitness dashboard interface" 
                className="rounded-3xl shadow-2xl w-full h-auto transform rotate-3 hover:rotate-0 transition-transform duration-500" 
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 glass-card p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Objectif atteint</div>
                    <div className="text-xs text-gray-400">+250 calories brûlées</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 glass-card p-4 animate-float" style={{animationDelay: '2s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Brain className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">IA Coach</div>
                    <div className="text-xs text-gray-400">Prêt à vous guider</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              4 modules de coaching
              <span className="gradient-text block">
                intelligents
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Notre IA s'adapte à vos besoins pour vous accompagner dans tous les aspects de votre transformation personnelle.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Training Module */}
            <Card className="glass-card-hover p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Entraînement</h3>
                <p className="text-gray-300 mb-4">Programmes sur mesure, suivi des séances, progression personnalisée.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Plans d'entraînement adaptatifs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Suivi temps réel
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Corrections posture IA
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Nutrition Module */}
            <Card className="glass-card-hover p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Apple className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Nutrition</h3>
                <p className="text-gray-300 mb-4">Scanner de plats, analyse nutritionnelle, recettes personnalisées.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Scanner IA des aliments
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Calcul automatique macros
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Recettes adaptées
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Mental Module */}
            <Card className="glass-card-hover p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Mental</h3>
                <p className="text-gray-300 mb-4">Coaching bien-être, méditation guidée, gestion du stress.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Exercices de respiration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Méditation personnalisée
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Analyse émotionnelle IA
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Productivity Module */}
            <Card className="glass-card-hover p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Productivité</h3>
                <p className="text-gray-300 mb-4">Routines optimisées, gestion des tâches, techniques de focus.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Planification intelligente
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Sessions focus
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500 h-4 w-4" />
                    Analyse performance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Votre dashboard
              <span className="gradient-text block">
                personnalisé
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Une interface intuitive qui centralise tous vos progrès et vous guide vers vos objectifs.
            </p>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="glass-card p-8 max-w-6xl mx-auto">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Bonjour, Jean Dupont</h3>
                  <p className="text-gray-400">Prêt pour votre transformation ?</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="glass-card bg-green-500/20 border-green-500/30 px-4 py-2">
                  <span className="text-green-400 text-sm font-medium">Streak: 7 jours</span>
                </div>
              </div>
            </div>
            
            {/* Dashboard Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Calories brûlées</span>
                  <Flame className="text-orange-500 h-4 w-4" />
                </div>
                <div className="text-2xl font-bold text-orange-500">847</div>
                <div className="text-xs text-gray-500">Objectif: 1000</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Entraînements</span>
                  <Dumbbell className="text-blue-500 h-4 w-4" />
                </div>
                <div className="text-2xl font-bold text-blue-500">4/5</div>
                <div className="text-xs text-gray-500">Cette semaine</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Méditation</span>
                  <Heart className="text-green-500 h-4 w-4" />
                </div>
                <div className="text-2xl font-bold text-green-500">12</div>
                <div className="text-xs text-gray-500">min aujourd'hui</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Productivité</span>
                  <ChartLine className="text-purple-500 h-4 w-4" />
                </div>
                <div className="text-2xl font-bold text-purple-500">89%</div>
                <div className="text-xs text-gray-500">Score du jour</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '89%'}}></div>
                </div>
              </div>
            </div>
            
            {/* AI Recommendations */}
            <div className="glass-card bg-primary/10 border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Brain className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold">Recommandations IA</h4>
                  <p className="text-sm text-gray-400">Basées sur vos données</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Dumbbell className="text-orange-500 h-4 w-4" />
                  <span className="text-sm">20 min de cardio recommandées pour atteindre votre objectif</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Apple className="text-green-500 h-4 w-4" />
                  <span className="text-sm">Augmentez vos protéines de 15g aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Choisissez votre
              <span className="gradient-text block">
                transformation
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Des plans adaptés à tous les niveaux pour commencer votre parcours de transformation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="glass-card-hover p-8">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Gratuit</h3>
                  <div className="text-4xl font-bold mb-4">0€<span className="text-lg text-gray-400">/mois</span></div>
                  <p className="text-gray-400">Parfait pour découvrir NOVAIA</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Accès limité aux 4 modules</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>3 séances d'entraînement/semaine</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Scanner nutrition basique</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Méditations guidées (5min max)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="text-red-500 h-4 w-4" />
                    <span className="text-gray-500">Coaching IA personnalisé</span>
                  </li>
                </ul>
                
                <Button onClick={handleStartFree} className="glass-button w-full py-3">
                  Commencer gratuitement
                </Button>
              </CardContent>
            </Card>
            
            {/* Premium Plan */}
            <Card className="glass-card bg-gradient-to-br from-primary/20 to-cyan-500/20 border-2 border-primary/50 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Le plus populaire
                </span>
              </div>
              
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-4xl font-bold mb-4">19€<span className="text-lg text-gray-400">/mois</span></div>
                  <p className="text-gray-400">Accès complet à tous les modules</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Accès complet aux 4 modules</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Entraînements illimités</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Scanner nutrition avancé</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Méditations illimitées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Coaching IA adaptatif</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Analyses détaillées</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={() => window.location.href = '/api/login'} 
                  className="primary-button w-full py-3"
                >
                  Choisir Premium
                </Button>
              </CardContent>
            </Card>
            
            {/* Pro+ Plan */}
            <Card className="glass-card-hover p-8">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Pro+</h3>
                  <div className="text-4xl font-bold mb-4">39€<span className="text-lg text-gray-400">/mois</span></div>
                  <p className="text-gray-400">Pour les transformations avancées</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Tout de Premium +</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Coaching IA personnalisé 24/7</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Plans nutritionnels sur mesure</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Correction posture en temps réel</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Support prioritaire</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-500 h-4 w-4" />
                    <span>Intégrations avancées</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={() => window.location.href = '/api/login'} 
                  className="glass-button w-full py-3"
                >
                  Choisir Pro+
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
      <DemoModal 
        isOpen={demoModalOpen} 
        onClose={() => setDemoModalOpen(false)} 
      />
    </div>
  );
}
