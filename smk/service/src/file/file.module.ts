import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [DatabaseModule],
})
export class FileModule {}
