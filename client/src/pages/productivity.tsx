import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Rocket, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Target, 
  TrendingUp,
  Plus,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Focus
} from "lucide-react";

interface ProductivitySession {
  id: string;
  sessionType: string;
  duration: number;
  tasksCompleted: number;
  focusScore: number;
  productivity: {
    tasksPlanned: number;
    distractions: number;
    techniques: string[];
  };
  completedAt: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function Productivity() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState("");
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [focusScore, setFocusScore] = useState(8);
  const [notes, setNotes] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/productivity/sessions"],
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
  }) as { data: ProductivitySession[] | undefined; isLoading: boolean };

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest("POST", "/api/productivity/sessions", sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/productivity/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Session enregistrée",
        description: "Votre session de productivité a été ajoutée avec succès !",
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
    setTasks([]);
    setNewTaskTitle("");
    setFocusScore(8);
    setNotes("");
    setSelectedTechnique("");
    resetTimer();
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTaskPriority = (taskId: string, priority: 'low' | 'medium' | 'high') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, priority } : task
    ));
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed).length;
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
      tasksCompleted: getCompletedTasks(),
      focusScore,
      productivity: {
        tasksPlanned: tasks.length,
        distractions: 10 - focusScore, // Estimate distractions from focus score
        techniques: selectedTechnique ? [selectedTechnique] : [],
      },
    });
  };

  const sessionTypes = [
    { value: "focus", label: "Session Focus", icon: Focus },
    { value: "pomodoro", label: "Pomodoro", icon: Timer },
    { value: "task_completion", label: "Tâches", icon: CheckCircle },
    { value: "planning", label: "Planification", icon: Target }
  ];

  const techniques = [
    "Technique Pomodoro",
    "Time Blocking",
    "Getting Things Done (GTD)",
    "Eat The Frog",
    "Matrice d'Eisenhower",
    "Deep Work",
    "Timeboxing"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Module Productivité</h1>
          <p className="text-gray-400">Optimisez votre temps et atteignez vos objectifs avec des techniques éprouvées</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Session Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Focus Timer */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Chronomètre de focus
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

                {/* Session Configuration */}
                <div className="space-y-4">
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
                    <Label htmlFor="technique" className="text-white">Technique utilisée</Label>
                    <Select value={selectedTechnique} onValueChange={setSelectedTechnique}>
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder="Sélectionner une technique" />
                      </SelectTrigger>
                      <SelectContent>
                        {techniques.map((technique) => (
                          <SelectItem key={technique} value={technique}>
                            {technique}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Manager */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Gestionnaire de tâches
                  </div>
                  <span className="text-sm text-gray-400">
                    {getCompletedTasks()}/{tasks.length} terminées
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Task */}
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Nouvelle tâche..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    className="glass-input flex-1"
                  />
                  <Button onClick={addTask} className="primary-button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Task List */}
                {tasks.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune tâche planifiée</p>
                    <p className="text-sm mt-2">Ajoutez des tâches à accomplir</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="glass-card p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                          />
                          <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.title}
                          </span>
                          <Select 
                            value={task.priority} 
                            onValueChange={(value) => updateTaskPriority(task.id, value as any)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">🟢 Faible</SelectItem>
                              <SelectItem value="medium">🟡 Normale</SelectItem>
                              <SelectItem value="high">🔴 Haute</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => removeTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Évaluation de session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Score de concentration (1-10)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={focusScore}
                      onChange={(e) => setFocusScore(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white font-medium w-8">{focusScore}/10</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-white">Notes de session (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Comment s'est passée votre session ? Quels obstacles avez-vous rencontrés ?"
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
                    <Rocket className="h-4 w-4 mr-2" />
                  )}
                  Enregistrer la session
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Insights */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {sessions?.length ? 
                        (sessions.reduce((acc, s) => acc + s.focusScore, 0) / sessions.length).toFixed(1) 
                        : '0'}
                    </div>
                    <div className="text-gray-400 text-sm">Score moyen de focus</div>
                    <div className="text-xs text-gray-500">sur 10</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-green-500 font-bold">
                        {sessions?.reduce((acc, s) => acc + s.tasksCompleted, 0) || 0}
                      </div>
                      <div className="text-xs text-gray-400">Tâches terminées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-500 font-bold">
                        {Math.floor((sessions?.reduce((acc, s) => acc + s.duration, 0) || 0) / 60)}h
                      </div>
                      <div className="text-xs text-gray-400">Temps total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-500 font-bold">
                        {sessions?.filter(s => {
                          const sessionDate = new Date(s.completedAt);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return sessionDate >= weekAgo;
                        }).length || 0}
                      </div>
                      <div className="text-xs text-gray-400">Sessions/semaine</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-500 font-bold">95%</div>
                      <div className="text-xs text-gray-400">Efficacité</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Techniques Usage */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Techniques favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {techniques.slice(0, 4).map((technique, index) => (
                    <div key={technique} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{technique}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{width: `${(4 - index) * 25}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{4 - index}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
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
                            <CheckCircle className="h-3 w-3" />
                            {session.tasksCompleted} tâches
                          </div>
                          <div className="flex items-center gap-1">
                            <Focus className="h-3 w-3" />
                            {session.focusScore}/10
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune session enregistrée</p>
                    <p className="text-sm mt-2">Commencez votre première session de productivité !</p>
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
