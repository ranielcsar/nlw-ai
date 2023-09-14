import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { fastifyMultipart } from '@fastify/multipart'
import path from 'node:path'
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { randomUUID } from 'node:crypto'

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  const megabyte = 1_048_576
  app.register(fastifyMultipart, { limits: { fileSize: megabyte * 25 } })

  app.post('/videos', async (req, reply) => {
    const data = await req.file()

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input.' })
    }

    const fileExtension = path.extname(data.filename)

    if (fileExtension !== '.mp3') {
      return reply
        .status(400)
        .send({ error: 'Invalid input type, please upload a MP3.' })
    }

    const fileBaseName = path.basename(data.filename, fileExtension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${fileExtension}`
    const uploadDestination = path.resolve(
      __dirname,
      '../../tmp',
      fileUploadName
    )

    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      },
    })

    return {
      video,
    }
  })
}
