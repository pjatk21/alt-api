import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { RedocModule, RedocOptions } from 'nestjs-redoc'
import { Logger, VersioningType } from '@nestjs/common'
import { Chance } from 'chance'
import { existsSync, readFileSync } from 'fs'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true })

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  })

  // Redoc init
  const docOpts = new DocumentBuilder()
    .setTitle('Altapi')
    .setDescription('Scrapper based alternative for blocked and outdated APIs.')
    .setVersion(process.env.npm_package_version ?? 'uhmm')
    .build()

  const doc = SwaggerModule.createDocument(app, docOpts, {
    include: [PublicTimetableModule],
  })

  const redocOpts: RedocOptions = {}

  await RedocModule.setup('/redoc', app, doc, redocOpts)
  SwaggerModule.setup('/swagger', app, doc)

  // Allow little bigger POSTs
  app.use(bodyParser.json({ limit: '500kB' }))

  // Init upload key
  if (process.env.ALTAPI_UPLOAD_KEY === undefined) {
    if (existsSync('.uploadkey')) {
      process.env.ALTAPI_UPLOAD_KEY = readFileSync('.uploadkey').toString().trim()
    } else {
      const ukl = new Logger('Upload key')
      ukl.warn('NO UPLOAD KEY PRESENT IN ENV!')
      const uploadKey = Array.from({ length: 4 }, () =>
        new Chance().pickone([new Chance().string(), new Chance().natural()]),
      ).join('-')
      ukl.warn('Save next code into .uploadkey file')
      ukl.warn(uploadKey)
      process.env.ALTAPI_UPLOAD_KEY = uploadKey
    }
  }

  await app.listen(4000)
}
bootstrap()
