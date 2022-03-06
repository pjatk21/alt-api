import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { APP_GUARD } from '@nestjs/core'
import { PublicTimetableService } from './public-timetable/public-timetable.service'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { HypervisorModule } from './hypervisor/hypervisor.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost/alt-pja'),
    PublicTimetableModule,
    HypervisorModule,
    ThrottlerModule.forRoot({ ttl: 600, limit: 3000 }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'alt-api-ui', 'dist'),
    }),
  ],
  controllers: [AppController],
  providers: [
    PublicTimetableService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
