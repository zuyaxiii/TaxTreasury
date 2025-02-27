import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Condo extends Document {
  @Prop({ required: true, unique: true })
  ID_LIST: string;

  @Prop()
  CONDO_ID: string;

  @Prop()
  CONDO_NAME: string;

  @Prop()
  BUILD_NAME: string;

  @Prop()
  CHANGWAT_CODE: number;

  @Prop()
  CHANGWAT_NAME: string;

  @Prop()
  AMPHUR_CODE: number;

  @Prop()
  AMPHUR_NAME: string;

  @Prop()
  TUMBON_CODE: number;

  @Prop()
  TUMBON_NAME: string;

  @Prop()
  BRANCH_CODE: number;

  @Prop()
  BRANCH_NAME: string;

  @Prop()
  OFLEVEL: string;

  @Prop()
  USE_CATG: string;

  @Prop()
  VAL_AMT_P_MET: number;

  @Prop({ default: Date.now })
  importedAt: Date;

  @Prop()
  firstImported: Date;
}

export const CondoSchema = SchemaFactory.createForClass(Condo);