import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { PublicTimetableService } from './public-timetable/public-timetable.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { HypervisorModule } from './hypervisor/hypervisor.module'
import { MongooseModule } from '@nestjs/mongoose'

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
  ],
  controllers: [AppController],
  providers: [PublicTimetableService],
})
export class AppModule {}
