import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Timings } from '@szmarczak/http-timer'
import { Document } from 'mongoose'
import { PJATKService } from '../service-check.enum'

export type ServiceCheckStatusDocument = ServiceCheckStatus & Document

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class ServiceCheckStatus {
  @Prop({ required: true, enum: PJATKService })
  service: PJATKService

  @Prop({ required: true })
  working: boolean

  @Prop()
  errorMessage?: string

  @Prop()
  status?: number

  @Prop({ type: Object })
  timings?: Timings

  @Prop()
  createdAt: Date
}

export const ServiceCheckStatusSchema = SchemaFactory.createForClass(ServiceCheckStatus)
