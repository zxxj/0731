import { Injectable } from '@nestjs/common';

@Injectable()
export class OtherService {
  sayHello() {
    return 'hello other service';
  }
}
