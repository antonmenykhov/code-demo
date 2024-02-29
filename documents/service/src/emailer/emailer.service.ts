import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmailerDto } from './dto/create-emailer.dto';
import { UpdateEmailerDto } from './dto/update-emailer.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { Emailer } from './entities/emailer.entity';
import { createTransport } from 'nodemailer';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';
import { EmailService } from 'src/email/email.service';
import { DocumentService } from 'src/document/document.service';
import { createReadStream } from 'fs';

@Injectable()
export class EmailerService extends DefaultCrud<
  Emailer,
  CreateEmailerDto,
  UpdateEmailerDto
> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private emailService: EmailService,
    private documentService: DocumentService,
  ) {
    super(Emailer, dataSource);
  }

  async createEmail(
    createEmailerDto: CreateEmailerDto,
    userInfo: AccessTokenRepresentationFull,
    token: string,
  ) {
    const transport = await this.createTransporter(
      createEmailerDto.fromEmailId,
    );
    const document = await this.documentService.findOne(
      createEmailerDto.documentId,
    );
    try {
      await transport.sendMail({
        from: `${document.company.name} ${createEmailerDto.fromEmail}`,
        to: createEmailerDto.toEmail,
        subject: createEmailerDto.theme,
        text: createEmailerDto.message,
        attachments: [
          {
            filename: `Исх. № ${document.regnumber}.pdf`,
            content: createReadStream(document.attachment.filePath),
          },
        ],
      });

      const emailer = await this.create({
        ...createEmailerDto,
        userId: userInfo.sub,
      });
      await this.documentService.addEmailSendedMark(
        document,
        emailer,
        document.emailers.length,
        token,
      );
      return emailer;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  private async createTransporter(emailId: number) {
    const settings = await this.emailService.findWithPassword(emailId);
    return createTransport({
      host: settings.host,
      port: settings.port,
      secure: true,
      auth: { user: settings.login, pass: settings.password },
    });
  }
}
