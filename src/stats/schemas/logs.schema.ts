import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DateTime } from 'luxon'

export type StatLogDocument = StatLog & Document

@Schema()
export class StatLog {
  @Prop({ default: () => DateTime.now().toJSDate(), index: true })
  recordedAt: Date

  @Prop()
  duration: number

  @Prop()
  target: string
}

export const StatLogSchema = SchemaFactory.createForClass(StatLog)
