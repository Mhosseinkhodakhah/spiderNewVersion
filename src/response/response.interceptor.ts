import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { format } from 'date-fns';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((res:any)=>{
      console.log('final test')
      this.responseHandler(res, context)
    }))
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    console.log('final test2')
    
    let newResponse = { success : (res.statusCode == 200) ? true : false ,  
      ...res , 
      error : (res.error) ? res.error : null ,
      data : (res.data) ? res.data : null ,
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss')}
    delete newResponse.statusCode
    return response.status(res.statusCode).json(newResponse)
  }
}
