import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { loginDto } from './dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/charge/:amount')
  async charge(@Req() req  :any, @Res() res : any , @Param('amount') amount : number){
    return this.appService.chargeTheAccount(+amount)
  }

  @Post('/login')
  async login(@Req() req  :any, @Res() res : any , @Body() body : loginDto){
    return this.appService.login(body)
  }

  @Post('/access/new')
  async createNewAccess(@Req() req  :any, @Res() res : any , @Body() body : any){
    return this.appService.createNewPermision( req , res, body)
  }


}
