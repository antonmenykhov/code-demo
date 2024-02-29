import {
  Controller,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';

@Controller('file')
@ApiTags('Файлы')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить файл' })
  create(@UploadedFile() file: Express.Multer.File, @Body() createFileDto:CreateFileDto) {
    return this.fileService.uploadFile(file, createFileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.remove(id);
  }
}
