import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DateTime } from 'luxon'
import { Document } from 'mongoose'
import { ScheduleEntryDto } from '../dto/schedule-entry.dto'

export type TimetableDocument = Timetable & Document

@Schema({ timestamps: true })
export class Timetable {
  @Prop({ required: true, type: ScheduleEntryDto })
  entry: ScheduleEntryDto

  @Prop({ required: true })
  htmlId: string

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable)
