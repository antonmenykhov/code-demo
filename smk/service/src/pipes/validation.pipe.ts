import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    if (metadata.type === 'custom') {
      return value;
    }
    const errors = await validate(obj, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length) {
      const messages = errors.map((err) => {
        return {
          value: err.property,
          error: err.constraints
            ? Object.values(err.constraints).join(', ')
            : 'Ошибка',
        };
      });
      throw new ValidationException({ messages });
    }
    return value;
  }
}
