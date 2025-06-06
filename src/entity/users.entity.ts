import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';

export interface UsersInterface extends Document {
  name: string;
  
  password: string;

  invoices: mongoose.Types.ObjectId[];
}

@Schema({ timestamps: true })
export class Users {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'invoice' , default :[] })
  invoices: mongoose.Types.ObjectId[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
