import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as S } from 'mongoose'
import { ScrapperVisa } from './scrapper-visa.schema'
import { DateTime, Duration } from 'luxon'

export type ScrapperTaskDocument = ScrapperTask & Document

@Schema({ versionKey: false })
export class ScrapperTask {
  @Prop({ required: true, type: S.Types.ObjectId, ref: ScrapperVisa.name })
  visa: ScrapperVisa

  @Prop({ required: true })
  socketId: string

  @Prop({ required: true })
  taskName: string

  @Prop({ default: () => new Date() })
  requestedAt: Date

  @Prop()
  finishedAt?: Date

  @Prop()
  failedAt?: Date

  public get taskStatus(): 'pending' | 'done' | 'failed' {
    if (this.finishedAt) return 'done'
    if (this.failedAt) return 'failed'
    return 'pending'
  }

  public get execTime(): Duration {
    if (this.taskStatus === 'pending') {
      return DateTime.fromJSDate(this.requestedAt).diffNow().negate()
    }
    return DateTime.fromJSDate(this.requestedAt).diff(
      DateTime.fromJSDate(this.finishedAt ?? this.failedAt),
    )
  }
}

export const ScrapperTaskSchema = SchemaFactory.createForClass(ScrapperTask)
