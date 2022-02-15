import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ScheduleEntry } from 'pja-scrapper/dist/interfaces'

export type TimetableDocument = Timetable & Document

@Schema()
export class Timetable {
  @Prop({ required: true, default: Date.now })
  uploadedAt: Date

  @Prop({ required: true, type: Object })
  entry: ScheduleEntry
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable)
