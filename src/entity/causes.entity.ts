import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export interface causesInterface extends Document{

    _id : mongoose.Types.ObjectId;

    causes : string;

    invoice : mongoose.Types.ObjectId[];

}



@Schema({timestamps : true})
export class causes{

    @Prop({type :String })
    causes : string;

    @Prop({type : [mongoose.Schema.Types.ObjectId], ref : 'invoice' , default : []})
    invoice : mongoose.Types.ObjectId[];

}



export const causesSchema = SchemaFactory.createForClass(causes)