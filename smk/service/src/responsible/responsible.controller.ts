import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('responsible')
@ApiTags('Ответственные за подразделения')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) {}

  @Post()
  create(@Body() createResponsibleDto: CreateResponsibleDto) {
    return this.responsibleService.create(createResponsibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsibleService.remove(+id);
  }
}
