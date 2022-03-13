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
import { HypervisorModule } from './hypervisor/hypervisor.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn', 'log'] : undefined,
  })

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  })

  // Redoc init
  const docOpts = new DocumentBuilder()
    .setTitle('Altapi')
    .setDescription(
      'Query PJA schedule in milliseconds. A great alternative to original webpage from 2010.<br>[![Run in Insomnia](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Altapi&uri=https%3A%2F%2Faltapi.kpostek.dev%2Fredoc%2Fopenapi.json)',
    )
    .setVersion(
      process.env.npm_package_version ??
        'RUN THIS BY "yarn start:prod" || "npm run start:prod"',
    )
    .setContact('Krystian Postek', undefined, 'kpostekk@pjwstk.edu.pl')
    .build()

  const doc = SwaggerModule.createDocument(app, docOpts, {
    include: [PublicTimetableModule, HypervisorModule],
  })

  const redocOpts: RedocOptions = {
    hideLoading: true,
    docName: 'openapi',
  }

  await RedocModule.setup('/redoc', app, doc, redocOpts)
  // SwaggerModule.setup('/swagger', app, doc)

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
