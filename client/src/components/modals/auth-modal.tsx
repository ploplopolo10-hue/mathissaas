import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onSwitchMode: (mode: "login" | "signup") => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    goal: "",
    terms: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would go through the actual authentication system
    console.log("Login attempt:", loginData);
    // Redirect to Replit Auth
    window.location.href = "/api/login";
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would go through the actual authentication system
    console.log("Signup attempt:", signupData);
    // Redirect to Replit Auth
    window.location.href = "/api/login";
  };

  const goals = [
    { value: "fitness", label: "Améliorer ma forme physique" },
    { value: "nutrition", label: "Équilibrer mon alimentation" },
    { value: "mental", label: "Améliorer mon bien-être mental" },
    { value: "productivity", label: "Booster ma productivité" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold">
            {mode === "login" ? "Connexion" : "Créer un compte"}
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

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="glass-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="glass-input"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={loginData.rememberMe}
                  onCheckedChange={(checked) => 
                    setLoginData({ ...loginData, rememberMe: checked as boolean })
                  }
                />
                <Label htmlFor="remember" className="text-white">Se souvenir de moi</Label>
              </div>
              <a href="#" className="text-primary hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <Button type="submit" className="primary-button w-full">
              Se connecter
            </Button>
            <p className="text-center text-sm text-gray-400">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("signup")}
                className="text-primary hover:underline"
              >
                Créer un compte
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white">Prénom</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jean"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white">Nom</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Dupont"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="glass-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="glass-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="goal" className="text-white">Objectif principal</Label>
              <Select value={signupData.goal} onValueChange={(value) => setSignupData({ ...signupData, goal: value })}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Sélectionner un objectif" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((goal) => (
                    <SelectItem key={goal.value} value={goal.value}>
                      {goal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Checkbox
                id="terms"
                checked={signupData.terms}
                onCheckedChange={(checked) => 
                  setSignupData({ ...signupData, terms: checked as boolean })
                }
                required
              />
              <Label htmlFor="terms" className="text-white">
                J'accepte les{" "}
                <a href="#" className="text-primary hover:underline">
                  conditions d'utilisation
                </a>
              </Label>
            </div>
            <Button type="submit" className="primary-button w-full">
              Créer mon compte
            </Button>
            <p className="text-center text-sm text-gray-400">
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className="text-primary hover:underline"
              >
                Se connecter
              </button>
            </p>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
