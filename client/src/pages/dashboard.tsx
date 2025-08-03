import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import { 
  Dumbbell, 
  Apple, 
  Heart, 
  Rocket, 
  Flame, 
  ChartLine, 
  Brain,
  TrendingUp,
  Target,
  Calendar
} from "lucide-react";

interface DashboardAnalytics {
  training: {
    weeklyGoal: number;
    completed: number;
    caloriesBurned: number;
    avgDuration: number;
  };
  nutrition: {
    dailyCalorieGoal: number;
    consumed: number;
    mealsLogged: number;
    waterIntake: number;
  };
  mental: {
    weeklyMeditationGoal: number;
    completed: number;
    avgMoodBefore: number;
    avgMoodAfter: number;
  };
  productivity: {
    dailyFocusGoal: number;
    achieved: number;
    tasksCompleted: number;
    avgFocusScore: number;
  };
  streakDays: number;
  weeklyScore: number;
}

interface AiRecommendation {
  id: string;
  module: string;
  title: string;
  description: string;
  priority: number;
  isRead: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/dashboard/analytics"],
    retry: false,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du dashboard",
        variant: "destructive",
      });
    },
  }) as { data: DashboardAnalytics | undefined; isLoading: boolean };

  const { data: recommendations } = useQuery({
    queryKey: ["/api/recommendations"],
    retry: false,
  }) as { data: AiRecommendation[] | undefined };

  if (analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'training': return <Dumbbell className="h-4 w-4" />;
      case 'nutrition': return <Apple className="h-4 w-4" />;
      case 'mental': return <Heart className="h-4 w-4" />;
      case 'productivity': return <Rocket className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'training': return 'text-orange-500';
      case 'nutrition': return 'text-green-500';
      case 'mental': return 'text-purple-500';
      case 'productivity': return 'text-blue-500';
      default: return 'text-primary';
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Bonjour, {user?.firstName || 'Coach'}
              </h1>
              <p className="text-gray-400">Prêt pour votre transformation ?</p>
            </div>
          </div>
          <div className="flex gap-4">
            {analytics?.streakDays && (
              <div className="glass-card bg-green-500/20 border-green-500/30 px-4 py-2">
                <span className="text-green-400 text-sm font-medium">
                  Streak: {analytics.streakDays} jours
                </span>
              </div>
            )}
            <div className="glass-card bg-primary/20 border-primary/30 px-4 py-2">
              <span className="text-primary text-sm font-medium">
                Score: {analytics?.weeklyScore || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Training Stats */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Entraînements</span>
                <Dumbbell className="text-orange-500 h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-orange-500">
                {analytics?.training.completed || 0}/{analytics?.training.weeklyGoal || 5}
              </div>
              <div className="text-xs text-gray-500 mb-2">Cette semaine</div>
              <Progress 
                value={((analytics?.training.completed || 0) / (analytics?.training.weeklyGoal || 5)) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Nutrition Stats */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Calories</span>
                <Flame className="text-green-500 h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-green-500">
                {analytics?.nutrition.consumed || 0}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Objectif: {analytics?.nutrition.dailyCalorieGoal || 2000}
              </div>
              <Progress 
                value={((analytics?.nutrition.consumed || 0) / (analytics?.nutrition.dailyCalorieGoal || 2000)) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Mental Stats */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Méditation</span>
                <Heart className="text-purple-500 h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-purple-500">
                {analytics?.mental.completed || 0}/{analytics?.mental.weeklyMeditationGoal || 7}
              </div>
              <div className="text-xs text-gray-500 mb-2">Sessions cette semaine</div>
              <Progress 
                value={((analytics?.mental.completed || 0) / (analytics?.mental.weeklyMeditationGoal || 7)) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Productivity Stats */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Productivité</span>
                <ChartLine className="text-blue-500 h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {analytics?.productivity.avgFocusScore || 0}/10
              </div>
              <div className="text-xs text-gray-500 mb-2">Score moyen</div>
              <Progress 
                value={(analytics?.productivity.avgFocusScore || 0) * 10}
                className="h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Access Modules */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Modules de coaching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/training">
                    <Button variant="outline" className="glass-button w-full justify-start gap-3 h-16">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Dumbbell className="text-white h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Entraînement</div>
                        <div className="text-xs text-gray-400">Programmes sur mesure</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/nutrition">
                    <Button variant="outline" className="glass-button w-full justify-start gap-3 h-16">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Apple className="text-white h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Nutrition</div>
                        <div className="text-xs text-gray-400">Scanner & recettes</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/mental">
                    <Button variant="outline" className="glass-button w-full justify-start gap-3 h-16">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Heart className="text-white h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Mental</div>
                        <div className="text-xs text-gray-400">Bien-être & méditation</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/productivity">
                    <Button variant="outline" className="glass-button w-full justify-start gap-3 h-16">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-500 rounded-lg flex items-center justify-center">
                        <Rocket className="text-white h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Productivité</div>
                        <div className="text-xs text-gray-400">Focus & routines</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progrès de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Objectifs atteints</span>
                    <span className="text-primary font-semibold">{analytics?.weeklyScore || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Calories brûlées</span>
                    <span className="text-orange-500 font-semibold">{analytics?.training.caloriesBurned || 0} kcal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tâches terminées</span>
                    <span className="text-blue-500 font-semibold">{analytics?.productivity.tasksCompleted || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Repas équilibrés</span>
                    <span className="text-green-500 font-semibold">{analytics?.nutrition.mealsLogged || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Recommendations */}
          <div className="space-y-6">
            <Card className="glass-card bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Recommandations IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations && recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="glass-card p-4">
                        <div className="flex items-start gap-3">
                          <div className={`${getModuleColor(rec.module)} mt-1`}>
                            {getModuleIcon(rec.module)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune recommandation pour le moment.</p>
                    <p className="text-sm mt-2">Utilisez les modules pour obtenir des conseils personnalisés.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/training">
                    <Button variant="outline" className="glass-button w-full justify-start gap-2">
                      <Dumbbell className="h-4 w-4 text-orange-500" />
                      Commencer un workout
                    </Button>
                  </Link>
                  <Link href="/nutrition">
                    <Button variant="outline" className="glass-button w-full justify-start gap-2">
                      <Apple className="h-4 w-4 text-green-500" />
                      Scanner un repas
                    </Button>
                  </Link>
                  <Link href="/mental">
                    <Button variant="outline" className="glass-button w-full justify-start gap-2">
                      <Heart className="h-4 w-4 text-purple-500" />
                      Méditer 5 min
                    </Button>
                  </Link>
                  <Link href="/productivity">
                    <Button variant="outline" className="glass-button w-full justify-start gap-2">
                      <Rocket className="h-4 w-4 text-blue-500" />
                      Session focus
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
