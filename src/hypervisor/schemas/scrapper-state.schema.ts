import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { HypervisorScrapperState } from '../hypervisor.enum'
import { ScrapperVisa } from './scrapper-visa.schema'

export type ScrapperStateDocument = ScrapperState & Document

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ScrapperState {
  @Prop({ required: true, type: Types.ObjectId, ref: 'ScrapperVisa' })
  visa: ScrapperVisa

  @Prop({ required: true })
  socketId: string

  @Prop({ required: true, enum: HypervisorScrapperState })
  newState: HypervisorScrapperState
}

export const ScrapperStateSchema = SchemaFactory.createForClass(ScrapperState)
