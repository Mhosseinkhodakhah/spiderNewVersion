import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersInterface } from './entity/users.entity';
import { accountantInterface } from './entity/account.entity';
import { loginDto } from './dto/login.dto';
import { Model, Models } from 'mongoose';
import * as crypto from 'crypto';
import { jwtService } from './jwt/jwt.service';
import { invoiceInterface } from './entity/invoice.entity';
import { createInvoiceDto } from './dto/createInvoice.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('user') private userModel: Model<UsersInterface>,
    @InjectModel('accountant') private accountantModel: Model<accountantInterface>,
    @InjectModel('invoice') private invoiceModel: Model<invoiceInterface>,
    private jwtService: jwtService,
  ) {}


  async chargeTheAccount( user : string, body : createInvoiceDto) {
    let userData = await this.userModel.findOne({name : user})

    if (!userData){
      return {
        message : 'user not found',
        statusCode : 400,
        error : 'user Not found ' 
      }
    }

    let invoice = new this.invoiceModel({
        amount : body.amount,
        user : userData._id,
        date : new Date().toLocaleString('fa-IR').split(',')[0],  
        time : new Date().toLocaleString('fa-IR').split(',')[1],
        cause : body.cause,
        type : 'deposit'
    })

    let created = await invoice.save()

    userData.invoices.push(created._id)

    await userData.save()

    let account = await this.accountantModel.find()
    account[0].balance = (+account[0].balance) + (+body.amount)
    await account[0].save()

    return {
      message : 'deposit successfully done',
      statusCode : 200,
      data : created
    }
  }







  async login(body: loginDto) {
    let { password } = body;
    console.log(password , typeof(password));
    let secret = 'asdflkzjndf;loiasjdfl;/akdmnfv;oaisdjfgklsda/f';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(password)
      .digest('hex');
      console.log(hash)
    let user = await this.userModel.findOne({ password: hash });
    if (!user) {
      return {
        message: 'permition denied!',
        statusCode: 403,
        error: 'permision denied',
      };
    }
    console.log('user issss >>>> ' , user)
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
  

  async checkToken(){
    return{
      message : 'token validate',
      statusCode : 200
    }
  }


}
