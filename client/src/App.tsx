import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Training from "@/pages/training";
import Nutrition from "@/pages/nutrition";
import Mental from "@/pages/mental";
import Productivity from "@/pages/productivity";
import Pricing from "@/pages/pricing";
import Subscribe from "@/pages/subscribe";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-black via-gray-900 to-blue-900">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-black via-gray-900 to-blue-900 text-white">
      {isAuthenticated && <Header />}
      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/pricing" component={Pricing} />
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/training" component={Training} />
            <Route path="/nutrition" component={Nutrition} />
            <Route path="/mental" component={Mental} />
            <Route path="/productivity" component={Productivity} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/subscribe" component={Subscribe} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      {!isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
