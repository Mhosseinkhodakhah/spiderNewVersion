import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class createInvoiceDto{

    @IsNotEmpty()
    @IsNumber()
    amount : number;

    @IsNotEmpty()
    @IsString()
    cause : string;

    @IsNotEmpty()
    @IsString()
    type : string;

}