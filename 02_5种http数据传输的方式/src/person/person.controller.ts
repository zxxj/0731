import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // query参数
  @Get('find')
  testQuery(@Query('username') username: string, @Query('age') age: number) {
    return `username: ${username}, age: ${age}`;
  }

  // url param参数
  // @Controller('api/pseron)的路由和@Get('id)的路由会拼到一起,也就是只有/api/person/xxx的get请求才会命中这个方法
  @Get(':id')
  urlParamTest(@Param('id') id: string) {
    return `id=${id}`;
  }

  // form urlencoded参数
  @Post()
  formURLEncoded(@Body() createPersonDto: CreatePersonDto) {
    return `obj: ${JSON.stringify(createPersonDto)}`;
  }

  // json
  @Post('testJson')
  json(@Body() CreatePersonDto: CreatePersonDto) {
    return `json: ${JSON.stringify(CreatePersonDto)}`;
  }

  // form data
  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  formData(
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('files:', files);
    return `obj: ${JSON.stringify(createPersonDto)}`;
  }
}
