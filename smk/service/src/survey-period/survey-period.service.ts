import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateSurveyPeriodDto } from './dto/create-survey-period.dto';
import { UpdateSurveyPeriodDto } from './dto/update-survey-period.dto';
import { SurveyPeriod } from './entities/survey-period.entity';
import { SendResultsDto } from 'src/emailer/dto/send-results-dto';

@Injectable()
export class SurveyPeriodService {
  constructor(private datbaseSerivce: DatabaseService) {}
  private repository =
    this.datbaseSerivce.connection.getRepository(SurveyPeriod);

  findAll() {
    return this.repository.find();
  }

  create(createSurveyPeriodDto: CreateSurveyPeriodDto) {
    return this.repository.save(createSurveyPeriodDto);
  }

  update(id: number, updateSurveyPeriodDto: UpdateSurveyPeriodDto) {
    return this.repository.save({ id, ...updateSurveyPeriodDto });
  }

  remove(id: number) {
    return this.repository.softDelete(id);
  }

  async setSended(sendResultsDto: SendResultsDto) {
    return this.repository.save({
      id: sendResultsDto.periodId,
      dateInput: sendResultsDto.dateInput,
      dateQuestions: sendResultsDto.dateQuestions,
      resultsSended: true,
    });
  }

  async findOne(id: number) {
    return this.repository.findOneOrFail({ id });
  }

  async getCurrentPeriods() {
    const periods = await this.repository
      .createQueryBuilder('period')
      .where(':date BETWEEN period.start AND period.finish', {
        date: new Date(),
      })
      .getMany();

    if (periods.length === 0) {
      throw new HttpException(
        { error: 'Нет активных опросов' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return periods[0];
  }
}
