import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ScheduleEntryDto } from '../dto/schedule-entry.dto'

export type TimetableDocument = Timetable & Document

@Schema()
export class Timetable {
  @Prop({ required: true, default: Date.now })
  uploadedAt: Date

  @Prop({ required: true, type: ScheduleEntryDto })
  entry: ScheduleEntryDto
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable)
