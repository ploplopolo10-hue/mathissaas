import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "Parfait pour découvrir NOVAIA",
      features: [
        { text: "Accès limité aux 4 modules", included: true },
        { text: "3 séances d'entraînement/semaine", included: true },
        { text: "Scanner nutrition basique", included: true },
        { text: "Méditations guidées (5min max)", included: true },
        { text: "Coaching IA personnalisé", included: false },
        { text: "Analyses détaillées", included: false },
        { text: "Support prioritaire", included: false },
      ],
      cta: "Commencer gratuitement",
      popular: false,
      action: isAuthenticated ? "/dashboard" : "/api/login"
    },
    {
      name: "Premium",
      price: "19€",
      period: "/mois",
      description: "Accès complet à tous les modules",
      features: [
        { text: "Accès complet aux 4 modules", included: true },
        { text: "Entraînements illimités", included: true },
        { text: "Scanner nutrition avancé", included: true },
        { text: "Méditations illimitées", included: true },
        { text: "Coaching IA adaptatif", included: true },
        { text: "Analyses détaillées", included: true },
        { text: "Support standard", included: true },
      ],
      cta: "Choisir Premium",
      popular: true,
      action: isAuthenticated ? "/subscribe?plan=premium" : "/api/login"
    },
    {
      name: "Pro+",
      price: "39€",
      period: "/mois",
      description: "Pour les transformations avancées",
      features: [
        { text: "Tout de Premium +", included: true },
        { text: "Coaching IA personnalisé 24/7", included: true },
        { text: "Plans nutritionnels sur mesure", included: true },
        { text: "Correction posture en temps réel", included: true },
        { text: "Support prioritaire", included: true },
        { text: "Intégrations avancées", included: true },
        { text: "Consultations expert", included: true },
      ],
      cta: "Choisir Pro+",
      popular: false,
      action: isAuthenticated ? "/subscribe?plan=pro" : "/api/login"
    }
  ];

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Choisissez votre
            <span className="gradient-text block">
              transformation
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Des plans adaptés à tous les niveaux pour commencer votre parcours de transformation personnelle.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-300">Mensuel</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-12 h-6 bg-gray-600 rounded-full shadow-inner"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform"></div>
            </div>
            <span className="text-gray-300">Annuel</span>
            <span className="text-green-400 text-sm font-medium">-20%</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative ${
                plan.popular 
                  ? "glass-card bg-gradient-to-br from-primary/20 to-cyan-500/20 border-2 border-primary/50 transform scale-105" 
                  : "glass-card-hover"
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Le plus populaire
                  </span>
                </div>
              )}

              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    {plan.price}
                    <span className="text-lg text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="text-green-500 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <X className="text-red-500 h-4 w-4 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-white" : "text-gray-500"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.action.startsWith('/') ? (
                  <Link href={plan.action}>
                    <Button 
                      className={`w-full py-3 ${
                        plan.popular 
                          ? "primary-button" 
                          : "glass-button"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => window.location.href = plan.action}
                    className={`w-full py-3 ${
                      plan.popular 
                        ? "primary-button" 
                        : "glass-button"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Questions fréquentes
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Puis-je changer de plan à tout moment ?",
                answer: "Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. Les changements prennent effet immédiatement."
              },
              {
                question: "Y a-t-il une période d'essai gratuite ?",
                answer: "Oui, vous pouvez utiliser NOVAIA gratuitement avec des fonctionnalités limitées. Aucune carte de crédit requise."
              },
              {
                question: "Comment fonctionne le coaching IA ?",
                answer: "Notre IA analyse vos données d'utilisation, vos progrès et vos préférences pour vous proposer des recommandations personnalisées et adaptatives."
              },
              {
                question: "Les données sont-elles sécurisées ?",
                answer: "Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous respectons strictement votre vie privée."
              },
              {
                question: "Puis-je annuler mon abonnement ?",
                answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre compte. Aucun frais d'annulation."
              }
            ].map((faq, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="glass-card bg-primary/10 border-primary/20 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Prêt à transformer votre vie ?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Rejoignez plus de 10 000 utilisateurs qui ont déjà commencé leur transformation avec NOVAIA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="primary-button px-8 py-3 text-lg">
                      Accéder au Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => window.location.href = "/api/login"}
                    className="primary-button px-8 py-3 text-lg"
                  >
                    Commencer maintenant
                  </Button>
                )}
                <Link href="/">
                  <Button variant="outline" className="glass-button px-8 py-3 text-lg">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
