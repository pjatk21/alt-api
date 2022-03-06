import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ScrapperPassportDto } from '../dto/passport.dto'

export type ScrapperVisaDocument = ScrapperVisa & Document

@Schema()
export class ScrapperVisa {
  @Prop({ type: Date })
  acceptedAt: Date

  @Prop({ required: true, type: ScrapperPassportDto })
  passport: ScrapperPassportDto

  @Prop({ required: true, default: false })
  active: boolean

  @Prop({ required: true })
  socketId: string
}

export const ScrapperVisaSchema = SchemaFactory.createForClass(ScrapperVisa)
