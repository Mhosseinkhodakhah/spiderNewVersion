import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersInterface } from './entity/users.entity';
import { accountantInterface } from './entity/account.entity';
import { loginDto } from './dto/login.dto';
import { Model, Models } from 'mongoose';
import * as crypto from 'crypto';
import { jwtService } from './jwt/jwt.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('user') private userModel: Model<UsersInterface>,
    @InjectModel('accountant')
    private accountantModel: Model<accountantInterface>,
    private jwtService: jwtService,
  ) {}

  async chargeTheAccount(amount: number) {}

  async login(body: loginDto) {
    let { password } = body;
    console.log(password);
    let secret = 'asdflkzjndf;loiasjdfl;/akdmnfv;oaisdjfgklsda/f';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(password)
      .digest('hex');
    let user = await this.userModel.findOne({ password: hash });
    if (!user) {
      return {
        message: 'permition denied!',
        statusCode: 403,
        error: 'permision denied',
      };
    }

    let token = await this.jwtService.tokenize({name : user.name}, '5M');
    return {
      message: 'permision granted!',
      statusCode: 200,
      data: { token, name: user.name },
    };
  }




  async createNewPermision(req , res , body) {
    console.log('22223' , body)

    let secret = 'asdflkzjndf;loiasjdfl;/akdmnfv;oaisdjfgklsda/f';
    const hash = crypto
    .createHmac('sha256', secret)
    .update(body.password)
    .digest('hex');



    console.log('553' , hash)

    let exist = await this.userModel.findOne({$or : [
      {name : body.name},
      {password : hash}
    ]})
    
    console.log(exist)

    if (exist){
      return { 
        message : 'user already exists',
        statusCode : 400,
        error : 'user already exists on databse'
      }
    }

    console.log('33333')

    let user = await this.userModel.create({ name: body.name, password: hash });
    return {
      message: 'permision add successfully',
      statusCode: 200,
      data: user,
    };
  }
}
