import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StatLog, StatLogSchema } from './schemas/logs.schema'
import { StatsService } from './stats.service'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost/alt-pja'),
    MongooseModule.forFeature([{ name: StatLog.name, schema: StatLogSchema }]),
  ],
  providers: [StatsService],
  exports: [MongooseModule.forFeature([{ name: StatLog.name, schema: StatLogSchema }])]
})
export class StatsModule {}
