import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class jwtService  {
    constructor(private readonly jwt: JwtService) { }


    async tokenize(user: any , time : string): Promise<string> {
        return this.jwt.sign(user, {
            secret: process.env.JWT_SECRET,
            expiresIn: time
        })
    }

    async refrshTokenize(user: any , time : string): Promise<string> {
        return this.jwt.sign(user, {
            secret: process.env.REFRESHTOKEN,
            expiresIn: time
        })
    }


    // async adminToken(user : any , time : string) : Promise<string>{
    //     return this.jwt.sign(user, {
    //         secret: process.env.JWT_ADMIN_SECRET,
    //         expiresIn: time
    //     })
    // }


    async checkRefreshToken(refreshToken : string){
        try {
            let check = this.jwt.verify(refreshToken , {secret : process.env.REFRESHTOKEN})
            console.log(check)
            return check
        } catch (error) {
            console.log(error)
            return false
        }
    }

    
}

