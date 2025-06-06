import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// const jwt = require('j')


@Injectable()
export class auth implements NestMiddleware {
  constructor(private readonly jwt:JwtService){}
  use(req: any, res: any, next: () => void) {
    // console.log(req.headers)
    console.log('test is here')
    let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  console.log('token>>>>>>' , token)
  // console.log(token)
  // console.log(token)

  if (!token) {
    console.log('its hereeeeeeeeeeee')
    return res.status(401).json({
      message :'token expired!',
      error : 'token is not exist'
    })
  }
  
  try {
    // Verify token
    const decoded = this.jwt.verify(token  , {secret : process.env.JWT_SECRET})
    // console.log('its decoded' , decoded)
    if (!decoded) {
    console.log('its hereeeeeeeeeeee222')
      return res.status(401).json({
        message :'token expired!',
        error : 'token expired'
      })
    }
    req.user = decoded;
    console.log('body of user' , req.user)
    next();
  } catch (err) {
    console.log('its hereeeeeeeeeeee333')
    return res.status(401).json({
      message :'token expired!',
      data : null,
      error : 'token expired!'
    })
  }
  }
}
