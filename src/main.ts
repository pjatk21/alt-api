import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

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

  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: './views',
  })

  await app.listen(3000)
}
bootstrap()
