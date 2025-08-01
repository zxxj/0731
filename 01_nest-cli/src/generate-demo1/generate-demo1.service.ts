import { Injectable } from '@nestjs/common';
import { CreateGenerateDemo1Dto } from './dto/create-generate-demo1.dto';
import { UpdateGenerateDemo1Dto } from './dto/update-generate-demo1.dto';

@Injectable()
export class GenerateDemo1Service {
  create(createGenerateDemo1Dto: CreateGenerateDemo1Dto) {
    return 'This action adds a new generateDemo1';
  }

  findAll() {
    return `This action returns all generateDemo1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generateDemo1`;
  }

  update(id: number, updateGenerateDemo1Dto: UpdateGenerateDemo1Dto) {
    return `This action updates a #${id} generateDemo1`;
  }

  remove(id: number) {
    return `This action removes a #${id} generateDemo1`;
  }
}
