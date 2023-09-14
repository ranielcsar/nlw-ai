import { Button, Separator, Textarea, Label } from '@/components/ui'
import { VideoInput } from '@/components/video-input'
import { Upload } from 'lucide-react'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '@/lib/api'
import { PromptSelect } from './prompt-select'
import { useAppContext } from '@/contexts'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Concluído!',
}

export function VideoForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const { setAppState } = useAppContext()

  const promptInputRef = useRef<HTMLTextAreaElement | null>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convertion started')
    const inputName = 'input.mp4'
    const outputName = 'output.mp3'

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile(inputName, await fetchFile(video))

    ffmpeg.on('progress', (progress) =>
      console.log(`Convertion progress: ${Math.round(progress.progress * 100)}`)
    )

    await ffmpeg.exec([
      '-i',
      inputName,
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      outputName,
    ])

    const data = await ffmpeg.readFile(outputName)

    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })
    const audioFile = new File([audioFileBlob], outputName, { type: 'audio/mpeg' })

    console.log('Convertion finished')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()

      const prompt = promptInputRef.current?.value

      if (!videoFile) return

      setStatus('converting')

      const audioFile = await convertVideoToAudio(videoFile)
      console.log(audioFile.size)
      const data = new FormData()

      data.append('file', audioFile)

      setStatus('uploading')

      const response = await api.post('/videos', data)
      const videoId = response.data.video.id as string

      setStatus('generating')

      await api.post(`/videos/${videoId}/transcription`, { prompt })

      setStatus('success')
      setAppState((state) => ({ ...state, videoId }))
    } catch (error) {
      setStatus('waiting')
      console.error(error)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <VideoInput onChange={handleFileSelected} selectedVideo={videoFile} />

      <Separator />

      <section className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          name="transcription_prompt"
          className="h-20 leading-relaxed"
          placeholder="Inclua palavras-chave menicionadas no vídeo separadas por vírgula (,)"
        />
      </section>

      <Separator />

      <section className="space-y-2">
        <Label htmlFor="selected_prompt">Prompt</Label>
        <PromptSelect />
      </section>

      <Button disabled={status !== 'waiting'} type="submit" className="w-full">
        {status !== 'waiting' ? (
          statusMessages[status]
        ) : (
          <>
            Carregar vídeo
            <Upload className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  )
}
