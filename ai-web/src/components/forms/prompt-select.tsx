import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppContext } from '@/contexts'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

type PromptProps = {
  id: string
  title: string
  template: string
}

export function PromptSelect() {
  const [prompts, setPrompts] = useState<PromptProps[] | null>(null)
  const { setAppState } = useAppContext()

  useEffect(() => {
    api.get('/prompts').then((response) => setPrompts(response.data))
  }, [])

  function handlePromptSelected(promptId: string) {
    const prompt = prompts?.find((prompt) => prompt.id === promptId)

    if (!prompt) return

    setAppState((state) => ({ ...state, promptSelected: prompt.template }))
  }

  return (
    <Select name="selected_prompt" onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt" />
      </SelectTrigger>

      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
