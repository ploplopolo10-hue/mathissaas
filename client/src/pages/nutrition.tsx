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
  Apple, 
  Camera, 
  Plus, 
  Target, 
  TrendingUp,
  Utensils,
  Zap,
  BarChart3,
  Salad
} from "lucide-react";

interface NutritionEntry {
  id: string;
  mealType: string;
  foodItems: FoodItem[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  loggedAt: string;
}

interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
}

export default function Nutrition() {
  const [selectedMealType, setSelectedMealType] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [scannerMode, setScannerMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["/api/nutrition/entries"],
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
  }) as { data: NutritionEntry[] | undefined; isLoading: boolean };

  const createEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      return await apiRequest("POST", "/api/nutrition/entries", entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Repas enregistré",
        description: "Votre repas a été ajouté avec succès !",
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
        description: "Impossible d'enregistrer le repas",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedMealType("");
    setFoodItems([]);
    setScannerMode(false);
  };

  const addFoodItem = () => {
    setFoodItems([...foodItems, {
      name: "",
      quantity: 100,
      unit: "g",
      calories: 0
    }]);
  };

  const updateFoodItem = (index: number, field: string, value: any) => {
    const updated = [...foodItems];
    updated[index] = { ...updated[index], [field]: value };
    setFoodItems(updated);
  };

  const removeFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
    const macros = {
      protein: Math.round(totalCalories * 0.25 / 4), // 25% protein
      carbs: Math.round(totalCalories * 0.45 / 4),   // 45% carbs
      fat: Math.round(totalCalories * 0.30 / 9),     // 30% fat
      fiber: Math.round(totalCalories * 0.02)        // Estimated fiber
    };
    return { totalCalories, macros };
  };

  const handleSubmit = () => {
    if (!selectedMealType || foodItems.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de repas et ajouter des aliments",
        variant: "destructive",
      });
      return;
    }

    const { totalCalories, macros } = calculateTotals();

    createEntryMutation.mutate({
      mealType: selectedMealType,
      foodItems,
      totalCalories,
      macros,
    });
  };

  const mealTypes = [
    { value: "breakfast", label: "Petit-déjeuner" },
    { value: "lunch", label: "Déjeuner" },
    { value: "dinner", label: "Dîner" },
    { value: "snack", label: "Collation" }
  ];

  const commonFoods = [
    { name: "Pomme", calories: 52, unit: "100g" },
    { name: "Banane", calories: 89, unit: "100g" },
    { name: "Riz blanc", calories: 130, unit: "100g" },
    { name: "Poulet grillé", calories: 165, unit: "100g" },
    { name: "Saumon", calories: 208, unit: "100g" },
    { name: "Brocolis", calories: 34, unit: "100g" },
    { name: "Avoine", calories: 389, unit: "100g" },
    { name: "Œuf", calories: 155, unit: "100g" }
  ];

  const getTodaysEntries = () => {
    if (!entries) return [];
    const today = new Date().toDateString();
    return entries.filter(entry => 
      new Date(entry.loggedAt).toDateString() === today
    );
  };

  const getTodaysCalories = () => {
    return getTodaysEntries().reduce((sum, entry) => sum + entry.totalCalories, 0);
  };

  const getTodaysMacros = () => {
    const todaysEntries = getTodaysEntries();
    return todaysEntries.reduce((total, entry) => ({
      protein: total.protein + entry.macros.protein,
      carbs: total.carbs + entry.macros.carbs,
      fat: total.fat + entry.macros.fat,
      fiber: total.fiber + entry.macros.fiber,
    }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });
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
          <h1 className="text-3xl font-bold text-white mb-2">Module Nutrition</h1>
          <p className="text-gray-400">Suivez votre alimentation et optimisez vos apports nutritionnels</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Food Logging */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Scanner */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Scanner IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!scannerMode ? (
                  <div className="text-center py-8">
                    <img 
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" 
                      alt="Food scanning interface" 
                      className="rounded-xl w-full h-48 object-cover mb-4"
                    />
                    <p className="text-gray-300 mb-4">
                      Scannez vos plats avec l'IA pour une analyse nutritionnelle instantanée
                    </p>
                    <Button onClick={() => setScannerMode(true)} className="primary-button">
                      <Camera className="h-4 w-4 mr-2" />
                      Activer le scanner
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="glass-card bg-primary/10 border-primary/20 p-6 mb-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="text-white h-8 w-8" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Scanner activé</h3>
                      <p className="text-gray-300 text-sm">
                        Cette fonctionnalité sera bientôt disponible. En attendant, ajoutez vos aliments manuellement.
                      </p>
                    </div>
                    <Button onClick={() => setScannerMode(false)} variant="outline" className="glass-button">
                      Retour
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Food Entry */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Ajouter un repas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mealType" className="text-white">Type de repas</Label>
                  <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Sélectionner un type de repas" />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Food Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white">Aliments</Label>
                    <Button onClick={addFoodItem} size="sm" className="primary-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>

                  {foodItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Salad className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun aliment ajouté</p>
                      <p className="text-sm mt-2">Commencez par ajouter des aliments</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {foodItems.map((item, index) => (
                        <div key={index} className="glass-card p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 md:col-span-1">
                              <Label className="text-white text-sm">Aliment</Label>
                              <Input
                                placeholder="Nom de l'aliment"
                                value={item.name}
                                onChange={(e) => updateFoodItem(index, 'name', e.target.value)}
                                className="glass-input"
                              />
                            </div>
                            <div>
                              <Label className="text-white text-sm">Quantité</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateFoodItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                className="glass-input"
                              />
                            </div>
                            <div>
                              <Label className="text-white text-sm">Calories</Label>
                              <Input
                                type="number"
                                value={item.calories}
                                onChange={(e) => updateFoodItem(index, 'calories', parseInt(e.target.value) || 0)}
                                className="glass-input"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                onClick={() => removeFoodItem(index)}
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
                </div>

                {/* Quick Add Common Foods */}
                <div>
                  <Label className="text-white">Aliments courants</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {commonFoods.map((food) => (
                      <Button
                        key={food.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setFoodItems([...foodItems, {
                          name: food.name,
                          quantity: 100,
                          unit: "g",
                          calories: food.calories
                        }])}
                        className="glass-button text-xs h-8"
                      >
                        {food.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Nutrition Summary */}
                {foodItems.length > 0 && (
                  <div className="glass-card bg-primary/10 border-primary/20 p-4">
                    <h4 className="text-white font-semibold mb-3">Résumé nutritionnel</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-orange-500 font-bold text-lg">{calculateTotals().totalCalories}</div>
                        <div className="text-gray-400">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-500 font-bold text-lg">{calculateTotals().macros.protein}g</div>
                        <div className="text-gray-400">Protéines</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-500 font-bold text-lg">{calculateTotals().macros.carbs}g</div>
                        <div className="text-gray-400">Glucides</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-500 font-bold text-lg">{calculateTotals().macros.fat}g</div>
                        <div className="text-gray-400">Lipides</div>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleSubmit} 
                  disabled={createEntryMutation.isPending}
                  className="primary-button w-full"
                >
                  {createEntryMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Apple className="h-4 w-4 mr-2" />
                  )}
                  Enregistrer le repas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & History */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Aujourd'hui
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {getTodaysCalories()}
                    </div>
                    <div className="text-gray-400 text-sm">Calories consommées</div>
                    <div className="text-xs text-gray-500">Objectif: 2000 kcal</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-green-500 font-bold">{getTodaysMacros().protein}g</div>
                      <div className="text-xs text-gray-400">Protéines</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-500 font-bold">{getTodaysMacros().carbs}g</div>
                      <div className="text-xs text-gray-400">Glucides</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-500 font-bold">{getTodaysMacros().fat}g</div>
                      <div className="text-xs text-gray-400">Lipides</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-500 font-bold">{getTodaysMacros().fiber}g</div>
                      <div className="text-xs text-gray-400">Fibres</div>
                    </div>
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
                    <span className="text-gray-300">Repas cette semaine</span>
                    <span className="text-primary font-semibold">
                      {entries?.filter(e => {
                        const entryDate = new Date(e.loggedAt);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return entryDate >= weekAgo;
                      }).length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Calories moyennes/jour</span>
                    <span className="text-orange-500 font-semibold">
                      {entries?.length ? Math.round(
                        entries.reduce((acc, e) => acc + e.totalCalories, 0) / 7
                      ) : 0} kcal
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Repas équilibrés</span>
                    <span className="text-green-500 font-semibold">
                      {entries?.filter(e => 
                        e.totalCalories >= 300 && e.totalCalories <= 800
                      ).length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Meals */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Repas récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entries && entries.length > 0 ? (
                  <div className="space-y-3">
                    {entries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="glass-card p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium capitalize">
                            {mealTypes.find(t => t.value === entry.mealType)?.label || entry.mealType}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(entry.loggedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-300">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {entry.totalCalories}kcal
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-green-500">P:</span>
                            {entry.macros.protein}g
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-blue-500">G:</span>
                            {entry.macros.carbs}g
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">L:</span>
                            {entry.macros.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Apple className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun repas enregistré</p>
                    <p className="text-sm mt-2">Commencez à suivre votre alimentation !</p>
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
