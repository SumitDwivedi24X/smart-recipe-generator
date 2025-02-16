import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface IngredientInputProps {
  label?: string
  ingredients: string[]
  setIngredients: (ingredients: string[]) => void
  isTagInput?: boolean
}

export function IngredientInput({
  label = "Ingredients",
  ingredients,
  setIngredients,
  isTagInput = false,
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault()
      if (isTagInput) {
        setIngredients([...ingredients, inputValue.trim()])
      } else {
        setIngredients([inputValue.trim()])
      }
      setInputValue("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={`Enter ${label.toLowerCase()} and press Enter`}
      />
      {isTagInput && (
        <div className="flex flex-wrap gap-2 mt-2">
          {ingredients.map((ingredient, index) => (
            <Badge key={index} variant="secondary">
              {ingredient}
              <button onClick={() => removeIngredient(ingredient)} className="ml-1">
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

