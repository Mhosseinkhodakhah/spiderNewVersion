import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';

export interface paymentInterface extends Document {

    _id :mongoose.Types.ObjectId

  balance: number;

  user: mongoose.Types.ObjectId;

  date: string;

  time: string;

  cause: mongoose.Types.ObjectId;

  title: string;

  payments : mongoose.Types.ObjectId[]

}

@Schema({ timestamps: true })
export class payment {
  @Prop({ type: Number })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Types.ObjectId;
    
  @Prop({type : [mongoose.Schema.Types.ObjectId] , default : []})
  payments : mongoose.Types.ObjectId[]
  
  @Prop({ type: String })
  date: string;

  @Prop({ type: String })
  title: string;
}


export const paymentSchema = SchemaFactory.createForClass(payment);
