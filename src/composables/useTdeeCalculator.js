// this function calculates the Basal Metabolic Rate (BMR) based on weight, height, age, and sex. 
// It uses the Mifflin-St Jeor Equation to estimate the number of calories a person needs to maintain their current weight at rest.
export function calculateBMR({ weightKg, heightCm, age = 25, sex = 'male' }) {
  if (!weightKg || !heightCm) return 2000 // Safe default fallback

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'female' ? base - 161 : base + 5// The BMR is calculated differently for males and females, with a subtraction of 161 for females and an addition of 5 for males, reflecting physiological differences in energy expenditure.
}

// this function calculates the Total Daily Energy Expenditure (TDEE) and macronutrient targets based on user profile data, planned exercises, and fitness goals.
export function calculateDailyTargets(userProfile, plannedExercises = [], userGoal = 'maintenance') {
  // Fallbacks if user profile attributes aren't fully set yet
  const weightKg = Number(userProfile?.weight) || 75
  const heightCm = Number(userProfile?.height) || 178
  const age = Number(userProfile?.age) || 24
  const sex = userProfile?.sex || 'male'

  // 1. Base BMR
  const bmr = calculateBMR({ weightKg, heightCm, age, sex })

  // 2. Base Daily Activity Multiplier (Non-exercise Activity Thermogenesis)
  let tdee = bmr * 1.2

  // 3. Dynamic Workout Burn Add-on based on planned exercises for the active day
  let plannedWorkoutCalories = 0
  if (plannedExercises.length > 0) {
    // Estimate ~8-10 kcal per set logged or ~150-300 kcal per planned workout session
    plannedWorkoutCalories = plannedExercises.reduce((sum, item) => {
      const sets = Number(item.parsedDetails?.sets) || 3
      return sum + sets * 25 // Approx 25 kcal burned per set
    }, 0)
  }

  tdee += plannedWorkoutCalories// Add the planned workout calories to the TDEE

  // 4. Adjust total target based on primary fitness goal
  let targetCalories = tdee
  if (userGoal === 'cutting' || userProfile?.goal === 'cut') {
    targetCalories -= 400 // Caloric deficit
  } else if (userGoal === 'bulking' || userProfile?.goal === 'bulk') {
    targetCalories += 300 // Caloric surplus
  }

  targetCalories = Math.round(targetCalories)

  // 5. Macro Distribution Ratios (40% Carbs / 30% Protein / 30% Fats)
  const proteinGrams = Math.round((targetCalories * 0.30) / 4) // 4 kcal/g
  const carbsGrams = Math.round((targetCalories * 0.40) / 4)   // 4 kcal/g
  const fatsGrams = Math.round((targetCalories * 0.30) / 9)    // 9 kcal/g

  return {
    calories: targetCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fats: fatsGrams,
    workoutBurn: plannedWorkoutCalories,
  }
}