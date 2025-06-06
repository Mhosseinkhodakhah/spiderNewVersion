import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';

export interface UsersInterface extends Document {
  name: string;
  password: string;
}

@Schema({ timestamps: true })
export class Users {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
