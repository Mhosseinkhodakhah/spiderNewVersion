import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersInterface } from './entity/users.entity';
import { accountantInterface } from './entity/account.entity';
import { loginDto } from './dto/login.dto';
import { Model, Models } from 'mongoose';
import * as crypto from 'crypto';
import { jwtService } from './jwt/jwt.service';
import { invoice, invoiceInterface } from './entity/invoice.entity';
import { createInvoiceDto } from './dto/createInvoice.dto';
import { causesInterface } from './entity/causes.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('user') private userModel: Model<UsersInterface>,
    @InjectModel('accountant')
    private accountantModel: Model<accountantInterface>,
    @InjectModel('invoice') private invoiceModel: Model<invoiceInterface>,
    @InjectModel('cause') private causeModel: Model<causesInterface>,
    private jwtService: jwtService,
  ) {}

  async chargeTheAccount(user: string, body: createInvoiceDto) {
    let userData = await this.userModel.findOne({ name: user });
    if (!userData) {
      return {
        message: 'user not found',
        statusCode: 400,
        error: 'user Not found ',
      };
    }

    let cause = await this.causeModel.findOne({ causes: body.cause });

    if (!cause) {
      cause = await this.causeModel.create({
        causes: body.cause,
        invoice: [],
      });
    }

    if (body.type == 'deposit') {
      let invoice = new this.invoiceModel({
        amount: body.amount,
        user: userData._id,
        date: new Date().toLocaleString('fa-IR').split(',')[0],
        time: new Date().toLocaleString('fa-IR').split(',')[1],
        cause: cause._id,
        type: 'deposit',
      });

      let created = await invoice.save();

      cause.invoice.push(created._id);

      await cause.save();

      userData.invoices.push(created._id);

      await userData.save();

      let account = await this.accountantModel.find();
      account[0].balance = +account[0].balance + +body.amount;
      await account[0].save();
      let updatedInvoice = await this.invoiceModel
        .findOne(created._id)
        .populate('cause')
        .populate('user');

      return {
        message: 'deposit successfully done',
        statusCode: 200,
        data: null,
      };
    } else if (body.type == 'withdraw') {
      let invoice = new this.invoiceModel({
        amount: body.amount,
        user: userData._id,
        date: new Date().toLocaleString('fa-IR').split(',')[0],
        time: new Date().toLocaleString('fa-IR').split(',')[1],
        cause: cause._id,
        type: 'withdraw',
      });

      let created = await invoice.save();
      cause.invoice.push(created._id);

      await cause.save();

      userData.invoices.push(created._id);

      await userData.save();

      let account = await this.accountantModel.find();
      account[0].balance = +account[0].balance - +body.amount;
      await account[0].save();

      let updatedInvoice = await this.invoiceModel
        .findOne(created._id)
        .populate('cause', 'user');

      return {
        message: 'withdraw successfully done',
        statusCode: 200,
        data: null,
      };
    } else {
      return {
        message: 'wrong type',
        statusCode: 400,
        error: 'type is not procecable',
      };
    }
  }

  async login(body: loginDto) {
    let { password } = body;
    console.log(password, typeof password);
    let secret = 'asdflkzjndf;loiasjdfl;/akdmnfv;oaisdjfgklsda/f';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(password)
      .digest('hex');
    console.log(hash);
    let user = await this.userModel.findOne({ password: hash });
    if (!user) {
      return {
        message: 'permition denied!',
        statusCode: 403,
        error: 'permision denied',
      };
    }
    console.log('user issss >>>> ', user);
    let token = await this.jwtService.tokenize({ name: user.name }, '168D');
    return {
      message: 'permision granted!',
      statusCode: 200,
      data: { token, name: user.name },
    };
  }

  async getCauses() {
    let causes = await this.causeModel.find();
    return {
      message: 'geting all causes',
      statusCode: 200,
      data: causes,
    };
  }

  async createNewPermision(req, res, body) {
    console.log('22223', body);

    let secret = 'asdflkzjndf;loiasjdfl;/akdmnfv;oaisdjfgklsda/f';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body.password)
      .digest('hex');

    console.log('553', hash);

    let exist = await this.userModel.findOne({
      $or: [{ name: body.name }, { password: hash }],
    });

    console.log(exist);

    if (exist) {
      return {
        message: 'user already exists',
        statusCode: 400,
        error: 'user already exists on databse',
      };
    }

    console.log('33333');

    let user = await this.userModel.create({ name: body.name, password: hash });
    return {
      message: 'permision add successfully',
      statusCode: 200,
      data: user,
    };
  }

  async checkToken() {
    return {
      message: 'token validate',
      statusCode: 200,
    };
  }

  async resetWallet() {
    let wallet = await this.accountantModel.find();
    // wallet[0].balance = 2515538;
    // await wallet[0].save();

    let all : any =await this.invoiceModel.find().populate('cause')
    
    for (let i of all){
      if (i.cause.causes == 'taxi' && i.amount == 30000){
        if (i.type == 'withdraw'){
          console.log('withdraw' , i.amount)
          wallet[0].balance = +wallet[0].balance + +i.amount
        }else{
          console.log('deposit', i.amount)
          wallet[0].balance = +wallet[0].balance - +i.amount
        }
        await wallet[0].save()
        await this.invoiceModel.findByIdAndDelete(i._id)
      }
    }


    return {
      message: 'true',
      statusCode: 200,
      data: wallet,
    };
  }

  async getAllInvoices(
    filter: string,
    sort: string,
    user: string,
    page: number,
  ) {
    console.log(filter);

    if (isNaN(+page)) {
      page = 0;
    }

    let invoices = await this.invoiceModel
      .find()
      .skip((+page - 1) * 10)
      .limit(10)
      .populate({ path: 'user', select: ['name'] })
      .populate({ path: 'cause', select: ['causes'] })
      .select(['type', 'user', 'cause', 'amount', 'createdAt'])
      .sort({ createdAt: -1 });

    let invoicesCounter = await this.invoiceModel.countDocuments();

    return {
      message: 'get all invoices',
      statusCode: 200,
      data: { invoices, all: Math.ceil(invoicesCounter/10) },
    };
  }


  async sumWithdraw(){
    let elhamAll : any = await this.userModel.findOne({name : 'elham'}).populate('invoices')
    if (!elhamAll){
      return {
        message : 'user not found!',
        statusCode : 400,
        error : 'user not found'
      }
    }
    let hosseinAll : any = await this.userModel.findOne({name : 'hossein'}).populate('invoices')
    let hosseinSum = 0
    let elhamSum = 0
    for (let i of elhamAll.invoices){
      if (i.type == 'withdraw') {
        elhamSum += i.amount
      }
    }
    for (let j of hosseinAll.invoices) {
      if (j.type == 'withdraw') {
        hosseinSum += j.amount
      }
        }
    let balance = await this.accountantModel.find()
    console.log(balance[0])
    let all  = await this.invoiceModel.aggregate([{
      $group:{
        _id : "$itemNumber",
        total : {$sum : '$amount'}
      }
    }])
    
    return {
      message : 'done',
      statusCode: 200,
      data : {allExpense : all[0].total , hosseinExpenses : hosseinSum , eliExpenses : elhamSum , balance : balance[0].balance}
    }
  }


}
