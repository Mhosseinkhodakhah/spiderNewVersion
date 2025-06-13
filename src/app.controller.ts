import { Body, Controller, Get, Param, Post, Query, Req, Res, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { loginDto } from './dto/login.dto';
import { createInvoiceDto } from './dto/createInvoice.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/invoice/create')
  async charge(
    @Req() req: any,
    @Res() res: any,
    @Body() body: createInvoiceDto,
  ) {
    let user = req.user.name;
    return this.appService.chargeTheAccount(user, body);
  }

  @Post('/login')
  async login(
    @Req() req: any,
    @Res() res: any,
    @Body(new ValidationPipe()) body: loginDto,
  ) {
    return this.appService.login(body);
  }

  @Post('/access/new')
  async createNewAccess(@Req() req: any, @Res() res: any, @Body() body: any) {
    return this.appService.createNewPermision(req, res, body);
  }

  @Get('/token/check')
  async checkToken(@Req() req: any, @Res() res: any) {
    return this.appService.checkToken();
  }

  @Get('cause/all')
  async getAllCauses(@Req() req: any, @Res() res: any) {
    return this.appService.getCauses();
  }

  @Get('/reset')
  async reset() {
    return this.appService.resetWallet();
  }

  @Get('invoice/all')
  async getAllInvoices(@Req() req: any, @Res() res: any) {
    let filter = req.query.filter;
    let sort = req.query.sort;
    let user = req.query.user;
    let page = req.query.page;
    console.log(filter , sort , page)
    return this.appService.getAllInvoices(filter , sort , user , page);
  }

  @Get('/all')
  async getAllSum(@Req() req: any, @Res() res: any){
    return this.appService.sumWithdraw()
  }


  @Post("/loan/create")
  async createNewLoan(@Req() req: any, @Res() res: any , @Body() body : any){
      await this.appService.createNewLoan(req , res , body)
  }

  @Get('/loan/all')
  async getAllLoan(@Req() req: any, @Res() res: any){
    await this.appService.getAllLoan()
  }

  @Post("/loan/pay/:loanId")
  async payTheLoan(@Req() req: any, @Res() res: any , @Body() body :any , @Param("loanId") loanId : string ){
    await this.appService.payTheLoan(req , res , body , loanId)
  }


}
