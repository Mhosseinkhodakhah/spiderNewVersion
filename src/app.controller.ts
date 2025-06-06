import { Body, Controller, Get, Param, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { loginDto } from './dto/login.dto';
import { createInvoiceDto } from './dto/createInvoice.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/invoice/create')
  async charge(@Req() req  :any, @Res() res : any , @Body() body : createInvoiceDto){
    let user = req.user.name
    return this.appService.chargeTheAccount( user , body)
  }

  @Post('/login')
  async login(@Req() req  :any, @Res() res : any , @Body(new ValidationPipe()) body : loginDto){
    return this.appService.login(body)
  }

  @Post('/access/new')
  async createNewAccess(@Req() req  :any, @Res() res : any , @Body() body : any){
    return this.appService.createNewPermision( req , res, body)
  }

  @Get('/token/check')
  async checkToken(@Req() req  :any, @Res() res : any){
    return this.appService.checkToken()
  }


  @Get('cause/all')
  async getAllCauses(@Req() req  :any, @Res() res : any){
    return this.appService.getCauses()
  }


  @Get('/reset')
  async reset(){
    return this.appService.resetWallet()
  }


}
