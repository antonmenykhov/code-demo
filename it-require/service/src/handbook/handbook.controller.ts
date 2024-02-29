import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HandbookService } from './handbook.service';
import { CreateHandbookDto } from './dto/create-handbook.dto';
import { UpdateHandbookDto } from './dto/update-handbook.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('handbook')
@ApiTags('Справочники')
export class HandbookController {
  constructor(private readonly handbookService: HandbookService) {}

  @Post()
  create(@Body() createHandbookDto: CreateHandbookDto) {
    return this.handbookService.create(createHandbookDto);
  }

  @Get()
  findAll() {
    return this.handbookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.handbookService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHandbookDto: UpdateHandbookDto,
  ) {
    return this.handbookService.update(+id, updateHandbookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.handbookService.remove(+id);
  }
}
