import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ScrapperPassportDto } from '../dto/passport.dto'

export type ScrapperVisaDocument = ScrapperVisa & Document

@Schema({ versionKey: false })
export class ScrapperVisa {
  @Prop({ required: true, type: ScrapperPassportDto })
  passport: ScrapperPassportDto

  @Prop({ required: true, default: false })
  active: boolean
}

export const ScrapperVisaSchema = SchemaFactory.createForClass(ScrapperVisa)
