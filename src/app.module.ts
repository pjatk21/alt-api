import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { PublicTimetableService } from './public-timetable/public-timetable.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { HypervisorModule } from './hypervisor/hypervisor.module'
import { MongooseModule } from '@nestjs/mongoose'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { APP_FILTER } from '@nestjs/core'
import { SentryAppExceptionsFilter } from './app.sentry'
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost/altapi'),
    PublicTimetableModule,
    HypervisorModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'alt-api-ui', 'dist'),
      exclude: ['/img*'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'alt-api-ui', 'img'),
      serveRoot: '/img',
    }),
    SentryModule.forRoot({
      dsn: 'https://a8784115835641679586d03c3f35dd77@o1084354.ingest.sentry.io/6292642',
      debug: true,
      environment: process.env.NODE_ENV ?? 'development',
      tracesSampleRate: 1.0,
      enabled: true,
    }),
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    PublicTimetableService,
    { provide: APP_FILTER, useClass: SentryAppExceptionsFilter },
  ],
})
export class AppModule {}
