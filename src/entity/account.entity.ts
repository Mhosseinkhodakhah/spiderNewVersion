import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';

export interface accountantInterface extends Document {
  balance: number;
}



@Schema({ timestamps: true })
export class accountant {
  @Prop({ type: Number })
  balance: number;
}



export const accountantSchema = SchemaFactory.createForClass(accountant);
