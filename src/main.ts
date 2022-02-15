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
        .setTitle('Alternative PJATK API')
        .setDescription('Scrapper based alternative for blocked and outdated APIs.')
        .build(),
    ),
  )

  await app.listen(3000)
}
bootstrap()
