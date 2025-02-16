import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, Utensils, ThermometerSun } from "lucide-react"

interface Recipe {
  title: string
  ingredients: string[]
  instructions: string[]
  extraIngredients: string[]
  cookingTime: string
  difficulty: string
}

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6">
        <CardTitle className="text-2xl font-bold">{recipe.title}</CardTitle>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{recipe.cookingTime}</span>
          </div>
          <Badge
            variant={
              recipe.difficulty === "Easy" ? "default" : recipe.difficulty === "Medium" ? "secondary" : "destructive"
            }
            className="text-white"
          >
            {recipe.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center text-lg text-green-600">
            <ChefHat className="w-5 h-5 mr-2" />
            Ingredients:
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm text-gray-700">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center text-lg text-blue-600">
            <Utensils className="w-5 h-5 mr-2" />
            Instructions:
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-gray-700">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
        {recipe.extraIngredients.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center text-lg text-yellow-600">
              <ThermometerSun className="w-5 h-5 mr-2" />
              Extra Ingredients:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.extraIngredients.map((ingredient, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

