import { FileVideo } from 'lucide-react'
import { InputHTMLAttributes, useMemo } from 'react'

type VideoInputProps = {
  selectedVideo?: File | null
} & InputHTMLAttributes<HTMLInputElement>

export function VideoInput(props: VideoInputProps) {
  const video = props.selectedVideo

  const previewUrl = useMemo(() => {
    if (!video) return null

    return URL.createObjectURL(video)
  }, [video])

  return (
    <>
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary-foreground/25"
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            controls={false}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <FileVideo />
            Carregar vídeo
          </>
        )}
      </label>

      <input type="file" id="video" accept="video/mp4" className="sr-only" {...props} />
    </>
  )
}
