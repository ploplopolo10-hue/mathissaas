import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Dumbbell, 
  Play, 
  Pause, 
  Timer, 
  Flame, 
  TrendingUp, 
  Plus,
  Activity,
  Target,
  Award
} from "lucide-react";

interface TrainingSession {
  id: string;
  workoutType: string;
  duration: number;
  caloriesBurned: number;
  exercises: Exercise[];
  notes: string;
  rating: number;
  completedAt: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

export default function Training() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Exercise[]>([]);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form states
  const [workoutType, setWorkoutType] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(5);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training/sessions"],
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
  }) as { data: TrainingSession[] | undefined; isLoading: boolean };

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest("POST", "/api/training/sessions", sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Séance enregistrée",
        description: "Votre séance d'entraînement a été ajoutée avec succès !",
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
        description: "Impossible d'enregistrer la séance",
        variant: "destructive",
      });
    },
  });

  const startTimer = () => {
    setIsTraining(true);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    setIsTraining(false);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };

  const resetTimer = () => {
    setIsTraining(false);
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
    setWorkoutType("");
    setCaloriesBurned("");
    setNotes("");
    setRating(5);
    setCurrentWorkout([]);
    resetTimer();
  };

  const handleSubmit = () => {
    if (!workoutType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type d'entraînement",
        variant: "destructive",
      });
      return;
    }

    createSessionMutation.mutate({
      workoutType,
      duration: Math.floor(timer / 60), // Convert to minutes
      caloriesBurned: parseInt(caloriesBurned) || 0,
      exercises: currentWorkout,
      notes,
      rating,
    });
  };

  const addExercise = () => {
    setCurrentWorkout([...currentWorkout, {
      name: "",
      sets: 3,
      reps: 10,
      weight: 0
    }]);
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const updated = [...currentWorkout];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentWorkout(updated);
  };

  const removeExercise = (index: number) => {
    setCurrentWorkout(currentWorkout.filter((_, i) => i !== index));
  };

  const workoutTypes = [
    "Cardio",
    "Musculation",
    "HIIT",
    "Yoga",
    "Course à pied",
    "Cyclisme",
    "Natation",
    "Crossfit",
    "Pilates",
    "Danse"
  ];

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
          <h1 className="text-3xl font-bold text-white mb-2">Module Entraînement</h1>
          <p className="text-gray-400">Créez et suivez vos séances d'entraînement personnalisées</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Current Workout */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer and Controls */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Chronomètre d'entraînement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-primary mb-4">
                    {formatTime(timer)}
                  </div>
                  <div className="flex justify-center gap-4">
                    {!isTraining ? (
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
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Workout Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="workoutType" className="text-white">Type d'entraînement</Label>
                    <Select value={workoutType} onValueChange={setWorkoutType}>
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {workoutTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="calories" className="text-white">Calories brûlées (estimation)</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="Ex: 250"
                      value={caloriesBurned}
                      onChange={(e) => setCaloriesBurned(e.target.value)}
                      className="glass-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-white">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Comment s'est passée votre séance ?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="glass-input"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-white">Évaluation de la séance</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          onClick={() => setRating(star)}
                          className={`p-2 ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                        >
                          ★
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    disabled={createSessionMutation.isPending}
                    className="primary-button w-full"
                  >
                    {createSessionMutation.isPending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Award className="h-4 w-4 mr-2" />
                    )}
                    Enregistrer la séance
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Exercices
                  </div>
                  <Button onClick={addExercise} size="sm" className="primary-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentWorkout.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun exercice ajouté</p>
                    <p className="text-sm mt-2">Cliquez sur "Ajouter" pour commencer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentWorkout.map((exercise, index) => (
                      <div key={index} className="glass-card p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="col-span-2 md:col-span-1">
                            <Label className="text-white text-sm">Exercice</Label>
                            <Input
                              placeholder="Nom de l'exercice"
                              value={exercise.name}
                              onChange={(e) => updateExercise(index, 'name', e.target.value)}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <Label className="text-white text-sm">Séries</Label>
                            <Input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                              className="glass-input"
                            />
                          </div>
                          <div>
                            <Label className="text-white text-sm">Répétitions</Label>
                            <Input
                              type="number"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                              className="glass-input"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              onClick={() => removeExercise(index)}
                              variant="destructive"
                              size="sm"
                              className="w-full"
                            >
                              Retirer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - History & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
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
                    <span className="text-gray-300">Séances cette semaine</span>
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
                    <span className="text-gray-300">Calories brûlées</span>
                    <span className="text-orange-500 font-semibold">
                      {sessions?.reduce((acc, s) => acc + (s.caloriesBurned || 0), 0) || 0} kcal
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Temps total</span>
                    <span className="text-green-500 font-semibold">
                      {Math.floor((sessions?.reduce((acc, s) => acc + s.duration, 0) || 0) / 60)}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Note moyenne</span>
                    <span className="text-yellow-500 font-semibold">
                      {sessions?.length ? 
                        (sessions.reduce((acc, s) => acc + s.rating, 0) / sessions.length).toFixed(1) 
                        : '0'}/5 ⭐
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Séances récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions && sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="glass-card p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium capitalize">
                            {session.workoutType}
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
                            <Flame className="h-3 w-3" />
                            {session.caloriesBurned}kcal
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{'⭐'.repeat(session.rating)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune séance enregistrée</p>
                    <p className="text-sm mt-2">Commencez votre première séance !</p>
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
