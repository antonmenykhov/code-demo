import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';

@Controller('email')
@ApiTags('Почтовые ящики')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Roles(['Initier'])
  @Post()
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.create(createEmailDto);
  }

  @Get()
  findAll() {
    return this.emailService.findAll();
  }

  @Roles(['Initier'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailService.findOne(+id);
  }

  @Roles(['Initier'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(+id, updateEmailDto);
  }

  @Roles(['Initier'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailService.remove(+id);
  }
}
