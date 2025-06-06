import { IsNotEmpty, IsString } from "@nestjs/class-validator";




export class loginDto{

    @IsNotEmpty()
    @IsString()
    password : string

}