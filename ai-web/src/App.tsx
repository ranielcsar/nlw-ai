import { Button, Separator, Textarea, Label, Slider } from '@/components/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Github, Wand2 } from 'lucide-react'
import { VideoForm } from '@/components/forms/video-form'
import { useAppContext } from './contexts'
import { useEffect, useState } from 'react'
import { useCompletion } from 'ai/react'

export function App() {
  const { appState } = useAppContext()
  const [temperature, setTemperature] = useState(0.5)

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } =
    useCompletion({
      api: 'http://localhost:3333',
      body: {
        videoId: appState?.videoId,
        temperature: appState?.temperature,
      },
    })

  useEffect(() => {
    if (appState?.promptSelected) setInput(appState.promptSelected as string)
  }, [appState?.promptSelected])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💛 na NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 flex gap-6">
        <aside className="w-80 space-y-6">
          <VideoForm />

          <Separator />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <section className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve
              </span>
            </section>

            <Separator />

            <section className="space-y-4">
              <Label>Temperatura</Label>

              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(values) => {
                  setTemperature(values[0])
                }}
              />

              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo e com
                possíveis erros.
              </span>
            </section>

            <Separator />

            <Button type="submit" className="w-full" disabled={isLoading}>
              Executar
              <Wand2 className="h-4 w-4 ml-2" />
            </Button>
          </form>
        </aside>

        <section className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              placeholder="Inclua o prompt para a IA..."
              className="resize-none p-4 leading-relaxed"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              readOnly
              placeholder="Resultado gerado pela IA"
              className="resize-none p-4 leading-relaxed"
              value={completion}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-primary">{'{transcription}'}</code> no seu prompt para
            adicionar o conteúdo do vídeo selecionado.
          </p>
        </section>
      </main>
    </div>
  )
}
