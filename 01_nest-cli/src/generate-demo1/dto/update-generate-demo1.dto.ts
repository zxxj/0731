import { PartialType } from '@nestjs/mapped-types';
import { CreateGenerateDemo1Dto } from './create-generate-demo1.dto';

export class UpdateGenerateDemo1Dto extends PartialType(CreateGenerateDemo1Dto) {}
