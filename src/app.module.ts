import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersSchema } from './entity/users.entity';
import { accountantSchema } from './entity/account.entity';
import { jwtService } from './jwt/jwt.service';
import { auth } from './auth/auth.middleware';
import { invoiceSchema } from './entity/invoice.entity';
import { causesSchema } from './entity/causes.entity';
import { loanSchema } from './entity/loan.entity';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: 'config.env' }), MulterModule.register({ dest: './accounting-files' }),
  MongooseModule.forRoot('mongodb+srv://kianlucifer0098:Lucifer25255225@first.9zb5fkd.mongodb.net/?retryWrites=true&w=majority&appName=first'),
  MongooseModule.forFeature([{name : 'user' , schema : UsersSchema},{name : 'loan' , schema : loanSchema},{name : 'cause' , schema : causesSchema},{name : 'invoice' , schema : invoiceSchema} , {name : 'accountant' , schema : accountantSchema}]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      // secret: process.env.JWT_SECRET,
      global: true
    }),
  }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'kianlucifer0098@gmail.com',
          pass: 'cnno pezo wooi qkpl',
        },
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService, jwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(auth).exclude('/login').exclude('/reset').forRoutes(AppController)
  }


}
