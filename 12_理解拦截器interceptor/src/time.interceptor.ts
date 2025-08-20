import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(context.getHandler(), context.getClass()); // [Function: getHello] [class AppController]

    // 统计接口耗时的功能

    // 记录开始时间
    const startTime = Date.now();

    // next.handle(): 继续执行后续逻辑(控制器方法)

    // .pipe(
    //   tap(() => {
    //     console.log('time', Date.now() - startTime);
    //   }),
    // ) 在请求执行完成,返回响应时,执行tap内的代码

    return next.handle().pipe(
      tap(() => {
        console.log('time', Date.now() - startTime);
      }),
    );
  }
}
