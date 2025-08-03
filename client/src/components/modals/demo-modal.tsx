import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Dumbbell, Apple, Heart, Rocket } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const handleStartDemo = () => {
    // In a production app, this would start an interactive demo or video
    console.log("Demo started");
    // For now, we'll just show a message
    alert("Démo interactive en cours de développement. Vous pouvez explorer l'application en créant un compte gratuit !");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border border-white/20 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold">
            Démo NOVAIA
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo Video Placeholder */}
          <div className="relative aspect-video glass-card bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=675" 
              alt="AI coaching demo interface" 
              className="rounded-xl w-full h-full object-cover" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <Button 
                onClick={handleStartDemo}
                className="w-20 h-20 bg-primary/80 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <Play className="text-white h-8 w-8 ml-1" />
              </Button>
            </div>
          </div>

          {/* Demo Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-white mb-4">Ce que vous verrez :</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Interface du dashboard personnalisé
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Coaching IA en action
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Scanner nutrition intelligent
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Programmes d'entraînement adaptatifs
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Modules présentés :</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 glass-card p-3 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Dumbbell className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Entraînement</div>
                    <div className="text-gray-400 text-sm">Programmes personnalisés</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 glass-card p-3 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Apple className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Nutrition</div>
                    <div className="text-gray-400 text-sm">Scanner IA des aliments</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 glass-card p-3 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Mental</div>
                    <div className="text-gray-400 text-sm">Méditation guidée</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 glass-card p-3 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-500 rounded-lg flex items-center justify-center">
                    <Rocket className="text-white h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Productivité</div>
                    <div className="text-gray-400 text-sm">Techniques de focus</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Info */}
          <div className="glass-card bg-primary/10 border-primary/20 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Play className="text-white h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-2">Durée : 3 minutes</h4>
                <p className="text-gray-300">
                  Découvrez comment NOVAIA peut transformer votre quotidien avec des démonstrations 
                  réelles de nos 4 modules de coaching IA.
                </p>
              </div>
              <Button onClick={handleStartDemo} className="primary-button px-6 py-3">
                <Play className="h-4 w-4 mr-2" />
                Lancer la démo
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
