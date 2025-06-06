import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';

export interface invoiceInterface extends Document {

    _id :mongoose.Types.ObjectId

  balance: number;

  user: mongoose.Types.ObjectId;

  date: string;

  time: string;

  cause: string;

  type: string;
}

@Schema({ timestamps: true })
export class invoice {
  @Prop({ type: Number })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: mongoose.Types.ObjectId;

  @Prop({ type: String })
  date: string;

  @Prop({ type: String })
  time: string;

  @Prop({ type: String })
  cause: string;

  @Prop({ type: String })
  type: string;
}

export const invoiceSchema = SchemaFactory.createForClass(invoice);
