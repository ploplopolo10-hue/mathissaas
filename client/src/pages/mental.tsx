import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Smile, 
  TrendingUp,
  Brain,
  Wind,
  BookOpen,
  Waves
} from "lucide-react";

interface MentalSession {
  id: string;
  sessionType: string;
  duration: number;
  moodBefore: number;
  moodAfter: number;
  notes: string;
  completedAt: string;
}

export default function Mental() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState("");
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [moodBefore, setMoodBefore] = useState([5]);
  const [moodAfter, setMoodAfter] = useState([5]);
  const [notes, setNotes] = useState("");
  const [selectedMeditation, setSelectedMeditation] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/mental/sessions"],
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
    },
  }) as { data: MentalSession[] | undefined; isLoading: boolean };

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest("POST", "/api/mental/sessions", sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mental/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Session enregistrée",
        description: "Votre session de bien-être a été ajoutée avec succès !",
      });
      resetForm();
    },
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
        description: "Impossible d'enregistrer la session",
        variant: "destructive",
      });
    },
  });

  const startTimer = () => {
    setIsSessionActive(true);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    setIsSessionActive(false);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };

  const resetTimer = () => {
    setIsSessionActive(false);
    setTimer(0);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetForm = () => {
    setSessionType("");
    setNotes("");
    setMoodBefore([5]);
    setMoodAfter([5]);
    setSelectedMeditation(null);
    resetTimer();
  };

  const handleSubmit = () => {
    if (!sessionType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de session",
        variant: "destructive",
      });
      return;
    }

    createSessionMutation.mutate({
      sessionType,
      duration: Math.floor(timer / 60), // Convert to minutes
      moodBefore: moodBefore[0],
      moodAfter: moodAfter[0],
      notes,
    });
  };

  const sessionTypes = [
    { value: "meditation", label: "Méditation", icon: Brain },
    { value: "breathing", label: "Respiration", icon: Wind },
    { value: "journaling", label: "Journal", icon: BookOpen },
    { value: "mood_check", label: "Check émotionnel", icon: Smile }
  ];

  const meditations = [
    {
      id: "stress-relief",
      title: "Gestion du stress",
      duration: "10 min",
      description: "Techniques de relaxation pour réduire le stress quotidien",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "focus-boost",
      title: "Améliorer la concentration",
      duration: "15 min",
      description: "Méditation pour augmenter votre focus et clarté mentale",
      image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "sleep-prep",
      title: "Préparation au sommeil",
      duration: "12 min",
      description: "Relaxation profonde pour un sommeil réparateur",
      image: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: "anxiety-calm",
      title: "Calmer l'anxiété",
      duration: "8 min",
      description: "Exercices de respiration pour apaiser l'anxiété",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    }
  ];

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😔";
    if (mood <= 4) return "😐";
    if (mood <= 6) return "🙂";
    if (mood <= 8) return "😊";
    return "😄";
  };

  const getAverageMoodImprovement = () => {
    if (!sessions || sessions.length === 0) return 0;
    const improvements = sessions.map(s => s.moodAfter - s.moodBefore);
    return improvements.reduce((acc, imp) => acc + imp, 0) / improvements.length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Module Mental</h1>
          <p className="text-gray-400">Prenez soin de votre bien-être mental avec des exercices guidés</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Session Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meditation Library */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Méditations guidées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {meditations.map((meditation) => (
                    <div key={meditation.id} className="glass-card p-4 cursor-pointer hover:bg-white/10 transition-colors"
                         onClick={() => setSelectedMeditation(meditation.id)}>
                      <img 
                        src={meditation.image} 
                        alt={meditation.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-white font-semibold mb-1">{meditation.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{meditation.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary text-sm font-medium">{meditation.duration}</span>
                        <Button size="sm" className="primary-button">
                          <Play className="h-3 w-3 mr-1" />
                          Commencer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Timer and Controls */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Session de bien-être
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-primary mb-4">
                    {formatTime(timer)}
                  </div>
                  <div className="flex justify-center gap-4">
                    {!isSessionActive ? (
                      <Button onClick={startTimer} className="primary-button">
                        <Play className="h-4 w-4 mr-2" />
                        Commencer
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} variant="outline" className="glass-button">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={resetTimer} variant="outline" className="glass-button">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Session Form */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="sessionType" className="text-white">Type de session</Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Humeur avant la session</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-2xl">{getMoodEmoji(moodBefore[0])}</span>
                      <Slider
                        value={moodBefore}
                        onValueChange={setMoodBefore}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-white font-medium w-8">{moodBefore[0]}/10</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Humeur après la session</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-2xl">{getMoodEmoji(moodAfter[0])}</span>
                      <Slider
                        value={moodAfter}
                        onValueChange={setMoodAfter}
                        max={10}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-white font-medium w-8">{moodAfter[0]}/10</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-white">Notes personnelles (optionnel)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Comment vous sentez-vous ? Quelles pensées avez-vous ?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="glass-input"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    disabled={createSessionMutation.isPending}
                    className="primary-button w-full"
                  >
                    {createSessionMutation.isPending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Heart className="h-4 w-4 mr-2" />
                    )}
                    Enregistrer la session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & History */}
          <div className="space-y-6">
            {/* Mood Tracker */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smile className="h-5 w-5" />
                  Suivi d'humeur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      +{getAverageMoodImprovement().toFixed(1)}
                    </div>
                    <div className="text-gray-400 text-sm">Amélioration moyenne</div>
                    <div className="text-xs text-gray-500">par session</div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((day) => (
                      <div key={day} className="text-center">
                        <div className="text-2xl mb-1">
                          {getMoodEmoji(Math.floor(Math.random() * 6) + 5)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {['L', 'M', 'M', 'J', 'V'][day - 1]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sessions cette semaine</span>
                    <span className="text-primary font-semibold">
                      {sessions?.filter(s => {
                        const sessionDate = new Date(s.completedAt);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return sessionDate >= weekAgo;
                      }).length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Temps total</span>
                    <span className="text-purple-500 font-semibold">
                      {Math.floor((sessions?.reduce((acc, s) => acc + s.duration, 0) || 0) / 60)}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Humeur moyenne</span>
                    <span className="text-green-500 font-semibold">
                      {sessions?.length ? 
                        (sessions.reduce((acc, s) => acc + s.moodAfter, 0) / sessions.length).toFixed(1) 
                        : '0'}/10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Streak actuel</span>
                    <span className="text-orange-500 font-semibold">3 jours 🔥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Sessions récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions && sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="glass-card p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium capitalize">
                            {sessionTypes.find(t => t.value === session.sessionType)?.label || session.sessionType}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(session.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-300">
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {session.duration}min
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Avant: {getMoodEmoji(session.moodBefore)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Après: {getMoodEmoji(session.moodAfter)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune session enregistrée</p>
                    <p className="text-sm mt-2">Commencez votre première session de bien-être !</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
