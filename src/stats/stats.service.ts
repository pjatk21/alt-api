import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { mean } from 'lodash'
import { DateTime } from 'luxon'
import { Model } from 'mongoose'
import { StatLog, StatLogDocument } from './schemas/logs.schema'

@Injectable()
export class StatsService {
  constructor(@InjectModel(StatLog.name) private statModel: Model<StatLogDocument>) {}

  async recordStats(url: string, duration: number) {
    await new this.statModel({ duration, target: url }).save()
  }

  async medianOfResponseTime(hoursBefore: number) {
    const afterHour = DateTime.now().minus({ hours: hoursBefore }).toJSDate()
    const lastLogs = await this.statModel
      .find({ recordedAt: { $gte: afterHour } })
      .sort({ recordedAt: 'descending' })
      .limit(100)
    const meanValue = mean(lastLogs.map((r) => r.duration))
    return { meanValue }
  }
}
