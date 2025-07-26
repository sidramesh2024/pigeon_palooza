
import { PigeonGallery } from '@/components/pigeon-gallery'

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pigeon Gallery
        </h1>
        <p className="text-xl text-gray-600">
          Browse all the amazing pigeons spotted around NYC!
        </p>
      </div>
      <PigeonGallery />
    </div>
  )
}
