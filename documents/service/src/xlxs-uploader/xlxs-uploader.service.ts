import { Injectable, OnModuleInit } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { ContractorDirectorService } from 'src/contractor-director/contractor-director.service';
import { CreateContractorDirectorDto } from 'src/contractor-director/dto/create-contractor-director.dto';
import { ContractorService } from 'src/contractor/contractor.service';
import { CreateContractorDto } from 'src/contractor/dto/create-contractor.dto';

@Injectable()
export class XlxsUploaderService {
  constructor(
    private contractorsService: ContractorService,
    private contractorDirectorsService: ContractorDirectorService,
  ) {}
  private xlsxDir = process.env.XLSX_DIR;

  async uploadContractors() {
    const workbook = new Workbook();
    try {
      const worksheet = (
        await workbook.xlsx.readFile(`${this.xlsxDir}\\contractors.xlsx`)
      ).getWorksheet('Лист1');

      const contractors: CreateContractorDto[] = [];
      worksheet.eachRow((row) => {
        contractors.push({
          name: String(row.getCell('A')),
          address: String(row.getCell('F')),
          reqisits: '',
          email: String(row.getCell('G')),
        });
      });
      const createdContractors =
        await this.contractorsService.createMany(contractors);
      const contractorDirectors: CreateContractorDirectorDto[] = [];
      worksheet.eachRow((row) => {
        contractorDirectors.push({
          name: String(row.getCell('B')) + ' ' + String(row.getCell('D')),
          formFullName: String(row.getCell('E')),
          formStaffName: String(row.getCell('C')),
          contractorId: createdContractors.find(
            (contractor) => contractor.name === String(row.getCell('A')),
          ).id,
        });
      });
      return this.contractorDirectorsService.createMany(contractorDirectors);
    } catch (error) {
      console.log(error);
    }
  }
}
