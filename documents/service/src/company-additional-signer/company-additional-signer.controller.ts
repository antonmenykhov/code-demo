import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyAdditionalSignerService } from './company-additional-signer.service';
import { CreateCompanyAdditionalSignerDto } from './dto/create-company-additional-signer.dto';
import { UpdateCompanyAdditionalSignerDto } from './dto/update-company-additional-signer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Дополнительные подписанты')
@Controller('company-additional-signer')
export class CompanyAdditionalSignerController {
  constructor(
    private readonly companyAdditionalSignerService: CompanyAdditionalSignerService,
  ) {}

  @Post()
  create(
    @Body() createCompanyAdditionalSignerDto: CreateCompanyAdditionalSignerDto,
  ) {
    return this.companyAdditionalSignerService.create(
      createCompanyAdditionalSignerDto,
    );
  }

  @Get()
  findAll() {
    return this.companyAdditionalSignerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyAdditionalSignerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyAdditionalSignerDto: UpdateCompanyAdditionalSignerDto,
  ) {
    return this.companyAdditionalSignerService.update(
      +id,
      updateCompanyAdditionalSignerDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyAdditionalSignerService.remove(+id);
  }
}
