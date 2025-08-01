import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenerateDemo1Service } from './generate-demo1.service';
import { CreateGenerateDemo1Dto } from './dto/create-generate-demo1.dto';
import { UpdateGenerateDemo1Dto } from './dto/update-generate-demo1.dto';

@Controller('generate-demo1')
export class GenerateDemo1Controller {
  constructor(private readonly generateDemo1Service: GenerateDemo1Service) {}

  @Post()
  create(@Body() createGenerateDemo1Dto: CreateGenerateDemo1Dto) {
    return this.generateDemo1Service.create(createGenerateDemo1Dto);
  }

  @Get()
  findAll() {
    return this.generateDemo1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generateDemo1Service.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGenerateDemo1Dto: UpdateGenerateDemo1Dto,
  ) {
    return this.generateDemo1Service.update(+id, updateGenerateDemo1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generateDemo1Service.remove(+id);
  }
}
