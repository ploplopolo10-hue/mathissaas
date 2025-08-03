import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ selectedPlan }: { selectedPlan: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment=success`,
      },
    });

    if (error) {
      toast({
        title: "Erreur de paiement",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Paiement réussi",
        description: "Bienvenue dans NOVAIA Premium !",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="primary-button w-full py-3"
      >
        {isLoading ? (
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
        ) : null}
        {isLoading ? "Traitement..." : `S'abonner à ${selectedPlan.name} - ${selectedPlan.price}`}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [location] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { toast } = useToast();

  const plans = {
    premium: {
      name: "Premium",
      price: "19€/mois",
      priceId: "price_premium_monthly", // This should be set from Stripe dashboard
      features: [
        "Accès complet aux 4 modules",
        "Entraînements illimités",
        "Scanner nutrition avancé",
        "Méditations illimitées",
        "Coaching IA adaptatif",
        "Analyses détaillées"
      ]
    },
    pro: {
      name: "Pro+",
      price: "39€/mois",
      priceId: "price_pro_monthly", // This should be set from Stripe dashboard
      features: [
        "Tout de Premium +",
        "Coaching IA personnalisé 24/7",
        "Plans nutritionnels sur mesure",
        "Correction posture en temps réel",
        "Support prioritaire",
        "Intégrations avancées",
        "Consultations expert"
      ]
    }
  };

  useEffect(() => {
    // Get plan from URL parameters
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const planParam = urlParams.get('plan');
    
    if (planParam && plans[planParam as keyof typeof plans]) {
      const plan = plans[planParam as keyof typeof plans];
      setSelectedPlan(plan);

      // Create subscription
      apiRequest("POST", "/api/create-subscription", { 
        priceId: plan.priceId,
        tier: planParam 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating subscription:", error);
          toast({
            title: "Erreur",
            description: "Impossible de créer l'abonnement. Veuillez réessayer.",
            variant: "destructive",
          });
        });
    } else {
      // Redirect to pricing if no valid plan
      window.location.href = "/pricing";
    }
  }, [location, toast]);

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="glass-card max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white">Préparation de votre abonnement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/pricing">
            <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux tarifs
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Finaliser votre abonnement</h1>
          <p className="text-gray-400">Complétez votre inscription et commencez votre transformation</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{selectedPlan.name}</h3>
                  <span className="text-primary font-bold text-xl">{selectedPlan.price}</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Inclus :</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <Check className="text-green-500 h-4 w-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-primary font-bold text-2xl">{selectedPlan.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Facturation mensuelle. Annulez à tout moment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Informations de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm selectedPlan={selectedPlan} />
              </Elements>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Paiement sécurisé par Stripe. Vos informations sont protégées.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guarantee */}
        <Card className="glass-card bg-green-500/10 border-green-500/20 mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-white font-bold mb-2">🔒 Garantie de satisfaction 30 jours</h3>
              <p className="text-gray-300">
                Essayez NOVAIA sans risque. Si vous n'êtes pas entièrement satisfait, 
                nous vous remboursons intégralement dans les 30 premiers jours.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
