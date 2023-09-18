# Projeto feito no evento NLW AI da Rocketseat 

O projeto tem como objetivo criar resultados gerados pela API da OpenAI a partir de prompts pré-cadastrados, para vídeos.
Nesse caso, na aplicação web, o usuário seleciona um vídeo, esse vídeo é convertido para MP3 com uma biblioteca chamada FFMpeg que usa WebAssembly, enviado para a API
de transcrição da OpenAI, chamada Whisper e, usando Streams do Node, é enviado a resposta para a aplicação web.

A resposta muda com base no prompt enviado, o qual o usuário pode editar.

## Tecnologias usadas na aplicação web:
  - React
  - Typescript
  - Axios
  - Vercel AI SDK
  - TailwindCSS
  - ViteJS
  - FFmpeg
  - RadixUI

## Tecnologias usadas na aplicação server (api):
- Fastify
- Prisma
- Zod
- Typescript
- OpenAI API/Lib
- Vercel AI SDK

## Fluxo da aplicação

1. Selecione um vídeo em formato **MP4** e logo após adicione pelo menos 3 palavras-chave que tem a ver com o vídeo.
2. Clique em converter e espere a conversão.
3. Selecione o prompt desejeado (você pode editar o prompt)
4. Ajuste a temperatura da resposta (quanto mais alta, mais criativa a resposta)
5. Execute a transcrição e veja a resposta sendo atualizada via streaming

> ranielcsar (ranoob) - 2023
