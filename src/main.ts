import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { RedocModule, RedocOptions } from 'nestjs-redoc'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

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

  // Allow HUGE POSTs
  app.use(bodyParser.json({ limit: '100mb' }))

  app.setBaseViewsDir('./views')
  app.setViewEngine('hbs')

  await app.listen(3000)
}
bootstrap()
