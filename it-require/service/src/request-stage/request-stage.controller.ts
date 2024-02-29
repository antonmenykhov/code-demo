import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestStageService } from './request-stage.service';
import { CreateRequestStageDto } from './dto/create-request-stage.dto';
import { UpdateRequestStageDto } from './dto/update-request-stage.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('request-stage')
@ApiTags('Стадии заявок')
export class RequestStageController {
  constructor(private readonly requestStageService: RequestStageService) {}

  @Post()
  create(@Body() createRequestStageDto: CreateRequestStageDto) {
    return this.requestStageService.create(createRequestStageDto);
  }

  @Get()
  findAll() {
    return this.requestStageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestStageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestStageDto: UpdateRequestStageDto,
  ) {
    return this.requestStageService.update(+id, updateRequestStageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestStageService.remove(+id);
  }
}
