import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecipeOutputProps {
  recipe: string
  substitutions: string
}

export function RecipeOutput({ recipe, substitutions }: RecipeOutputProps) {
  if (!recipe) return null

  return (
    <div className="mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Generated Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: recipe }} />
        </CardContent>
      </Card>
      {substitutions && (
        <Card>
          <CardHeader>
            <CardTitle>Substitutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: substitutions }} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

