import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';

@Controller('contractor')
@ApiTags('Контрагенты')
export class ContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @Post()
  create(@Body() createContractorDto: CreateContractorDto) {
    return this.contractorService.create(createContractorDto);
  }

  @Get()
  findAll() {
    return this.contractorService.findAll();
  }

  @Roles(['Initier'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractorService.findOne(+id);
  }

  @Roles(['Initier'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractorDto: UpdateContractorDto,
  ) {
    return this.contractorService.update(+id, updateContractorDto);
  }

  @Roles(['Initier'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractorService.remove(+id);
  }
}
