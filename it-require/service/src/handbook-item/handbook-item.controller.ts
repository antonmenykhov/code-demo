import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HandbookItemService } from './handbook-item.service';
import { CreateHandbookItemDto } from './dto/create-handbook-item.dto';
import { UpdateHandbookItemDto } from './dto/update-handbook-item.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('handbook-item')
@ApiTags('Элементы справочника')
export class HandbookItemController {
  constructor(private readonly handbookItemService: HandbookItemService) {}

  @Post()
  create(@Body() createHandbookItemDto: CreateHandbookItemDto) {
    return this.handbookItemService.create(createHandbookItemDto);
  }

  @Get()
  findAll() {
    return this.handbookItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.handbookItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHandbookItemDto: UpdateHandbookItemDto,
  ) {
    return this.handbookItemService.update(+id, updateHandbookItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.handbookItemService.remove(+id);
  }
}
