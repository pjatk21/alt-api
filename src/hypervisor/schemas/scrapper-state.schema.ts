import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as S } from 'mongoose'
import { HypervisorScrapperState } from '../hypervisor.enum'
import { ScrapperVisa } from './scrapper-visa.schema'

export type ScrapperStateDocument = ScrapperState & Document

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class ScrapperState {
  @Prop({ required: true, type: S.Types.ObjectId, ref: ScrapperVisa.name })
  visa: ScrapperVisa

  @Prop({ required: true })
  socketId: string

  @Prop({ required: true, enum: HypervisorScrapperState })
  newState: HypervisorScrapperState

  @Prop()
  createdAt: Date
}

export const ScrapperStateSchema = SchemaFactory.createForClass(ScrapperState)
