import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Swagger init
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Altapi')
        .setDescription('Scrapper based alternative for blocked and outdated APIs.')
        .setVersion(process.env.npm_package_version ?? 'uhmm')
        .build(),
    ),
  )

  // Allow HUGE POSTs
  app.use(bodyParser.json({ limit: '100mb' }))

  app.setBaseViewsDir('./views')
  app.setViewEngine('hbs')

  await app.listen(3000)
}
bootstrap()
