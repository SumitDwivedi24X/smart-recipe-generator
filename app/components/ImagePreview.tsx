import Image from "next/image"

interface ImagePreviewProps {
  images: string[]
}

export function ImagePreview({ images }: ImagePreviewProps) {
  if (images.length === 0) return null

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

