import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContractorDirectorService } from './contractor-director.service';
import { CreateContractorDirectorDto } from './dto/create-contractor-director.dto';
import { UpdateContractorDirectorDto } from './dto/update-contractor-director.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';

@ApiTags('Директора контрагентов')
@Controller('contractor-director')
export class ContractorDirectorController {
  constructor(
    private readonly contractorDirectorService: ContractorDirectorService,
  ) {}

  @Roles(['Initier'])
  @Post()
  create(@Body() createContractorDirectorDto: CreateContractorDirectorDto) {
    return this.contractorDirectorService.create(createContractorDirectorDto);
  }

  @Get()
  findAll() {
    return this.contractorDirectorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractorDirectorService.findOne(+id);
  }

  @Roles(['Initier'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractorDirectorDto: UpdateContractorDirectorDto,
  ) {
    return this.contractorDirectorService.update(
      +id,
      updateContractorDirectorDto,
    );
  }

  @Roles(['Initier'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractorDirectorService.remove(+id);
  }
}
