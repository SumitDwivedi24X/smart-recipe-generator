"use client"

import { useState } from "react"
import { ImageUploader } from "./components/ImageUploader"
import { IngredientInput } from "./components/IngredientInput"
import { RecipeCard } from "./components/RecipeCard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ImagePreview } from "./components/ImagePreview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface Recipe {
  title: string
  ingredients: string[]
  instructions: string[]
  extraIngredients: string[]
  cookingTime: string
  difficulty: string
}

const dietaryOptions = [
  { id: "non-veg", label: "Non-Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
]

export default function RecipeGenerator() {
  const [mode, setMode] = useState<"image" | "manual">("image")
  const [images, setImages] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<string>("")
  const [excludedIngredients, setExcludedIngredients] = useState<Set<string>>(new Set())
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setRecipes([])
    setError(null)

    const API_KEY = "GEMINI_API_KEY";

    if (!API_KEY) {
      setError("API key is missing. Please check your environment variables.")
      setIsLoading(false)
      return
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      let prompt = "Generate 3 unique recipe ideas based on the following requirements:\n\n"

      if (dietaryRestrictions.length > 0) {
        prompt += "DIETARY REQUIREMENTS:\n"
        dietaryRestrictions.forEach((restriction) => {
          prompt += `- ${restriction}\n`
        })
        prompt += "\n"
      }

      if (excludedIngredients.size > 0) {
        prompt += "EXCLUDED INGREDIENTS:\n"
        Array.from(excludedIngredients).forEach((ingredient) => {
          prompt += `- ${ingredient}\n`
        })
        prompt += "\n"
      }

      if (mode === "image") {
        prompt += "ANALYSIS REQUIREMENTS:\n"
        prompt += "1. Use common ingredients typically found in kitchens\n"
        prompt += "2. Create recipes based on these common ingredients\n"
      } else {
        prompt += "INGREDIENTS:\n" + ingredients + "\n\n"
      }

      prompt += "For each recipe, provide:\n"
      prompt += "1. Title\n"
      prompt += "2. Ingredients list (DO NOT include any excluded ingredients)\n"
      prompt += "3. Brief cooking instructions\n"
      prompt +=
        "4. List of extra ingredients used (not in the original list or images, and not in excluded ingredients)\n"
      prompt += "5. Cooking time\n"
      prompt += "6. Difficulty level (Easy, Medium, Hard)\n"
      prompt +=
        "\nIMPORTANT: Do not use asterisks, bold formatting, or any special characters in the generated text. Provide clean, plain text output.\n"

      const result = await model.generateContent(prompt)
      const response = await result.response
      const fullText = response.text()

      // Parse the generated recipes
      const recipeRegex = /Recipe (\d+):([\s\S]*?)(?=Recipe \d+:|$)/g
      let match
      const parsedRecipes: Recipe[] = []

      const cleanText = (text: string) => {
        return text.replace(/\*\*/g, "").trim()
      }

      while ((match = recipeRegex.exec(fullText)) !== null) {
        const recipeText = cleanText(match[2])
        const titleMatch = recipeText.match(/Title:(.*)/i)
        const ingredientsMatch = recipeText.match(/Ingredients:([\s\S]*?)(?=Instructions:|$)/i)
        const instructionsMatch = recipeText.match(/Instructions:([\s\S]*?)(?=Extra Ingredients:|$)/i)
        const extraIngredientsMatch = recipeText.match(/Extra Ingredients:([\s\S]*?)(?=Cooking time:|$)/i)
        const cookingTimeMatch = recipeText.match(/Cooking time:(.*)/i)
        const difficultyMatch = recipeText.match(/Difficulty:(.*)/i)

        if (titleMatch && ingredientsMatch && instructionsMatch) {
          const ingredients = ingredientsMatch[1]
            .split("\n")
            .map((i) => cleanText(i))
            .filter((i) => i && !excludedIngredients.has(i.toLowerCase()))

          const extraIngredients = extraIngredientsMatch
            ? extraIngredientsMatch[1]
                .split("\n")
                .map((i) => cleanText(i))
                .filter((i) => i && !excludedIngredients.has(i.toLowerCase()))
            : []

          parsedRecipes.push({
            title: cleanText(titleMatch[1]),
            ingredients,
            instructions: instructionsMatch[1]
              .split("\n")
              .map((i) => cleanText(i))
              .filter((i) => i),
            extraIngredients,
            cookingTime: cookingTimeMatch ? cleanText(cookingTimeMatch[1]) : "",
            difficulty: difficultyMatch ? cleanText(difficultyMatch[1]) : "",
          })
        }
      }

      setRecipes(parsedRecipes)
    } catch (error) {
      console.error("Error generating recipes:", error)
      setError("An error occurred while generating the recipes. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[url('/wooden-background.jpg')] bg-cover bg-center">
      <div className="container mx-auto p-4 bg-white/90 min-h-screen">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-green-800">Recipe Generator</h1>
        </header>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Tabs value={mode} onValueChange={(value) => setMode(value as "image" | "manual")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">Image Mode</TabsTrigger>
            <TabsTrigger value="manual">Manual Mode</TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <ImageUploader images={images} setImages={setImages} />
          </TabsContent>
          <TabsContent value="manual">
            <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
          </TabsContent>
        </Tabs>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Dietary Options</h2>
          <div className="flex flex-wrap gap-4">
            {dietaryOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={dietaryRestrictions.includes(option.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDietaryRestrictions([...dietaryRestrictions, option.id])
                    } else {
                      setDietaryRestrictions(dietaryRestrictions.filter((id) => id !== option.id))
                    }
                  }}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <IngredientInput
          label="Excluded Ingredients"
          ingredients={Array.from(excludedIngredients)}
          setIngredients={(ingredients) => setExcludedIngredients(new Set(ingredients))}
          isTagInput
        />
        <Button onClick={handleGenerate} disabled={isLoading} className="mt-6 w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Recipes"
          )}
        </Button>
        <ImagePreview images={images} />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}

