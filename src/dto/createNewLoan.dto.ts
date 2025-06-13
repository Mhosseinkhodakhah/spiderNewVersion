import { IsNotEmpty, IsNumber, IsString } from "class-validator"



export class newLoanDto {

    @IsNotEmpty()
    @IsString()
    amount: number

    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    date: string

    @IsNotEmpty()
    @IsNumber()
    settleMentCount: number

}