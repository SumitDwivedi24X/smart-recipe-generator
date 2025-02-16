import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"

interface ImageUploaderProps {
  images: string[]
  setImages: (images: string[]) => void
}

export function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([""])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImages((prevImages) => [...prevImages, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    },
    [setImages],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUrlChange = (index: number, url: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = url
    setImageUrls(newUrls)
  }

  const handleFileUpload = (index: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImages = [...images]
      newImages[index] = e.target?.result as string
      setImages(newImages)
    }
    reader.readAsDataURL(file)
  }

  const addImageInput = () => {
    setImageUrls([...imageUrls, ""])
  }

  const removeImageInput = (index: number) => {
    const newUrls = [...imageUrls]
    newUrls.splice(index, 1)
    setImageUrls(newUrls)

    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag 'n' drop some images here, or click to select files</p>
        )}
      </div>
      {imageUrls.map((url, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="url"
            placeholder="Paste image URL here"
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
          />
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded text-sm inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Choose File
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(index, e.target.files![0])}
              className="hidden"
            />
          </motion.label>
          {index > 0 && <Button onClick={() => removeImageInput(index)}>Remove</Button>}
          {url && <img src={url || "/placeholder.svg"} alt="Preview" className="w-16 h-16 object-cover" />}
        </div>
      ))}
      <Button onClick={addImageInput}>Add Image</Button>
    </div>
  )
}

