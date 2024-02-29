import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserMapping } from 'src/keycloak/userMapping.decorator';
import { Delegation } from 'src/delegation/entities/delegation.entity';
import { DocumentReport } from './dto/document-report.dto';
import { UserInfo } from 'src/users/userInfo.decorator';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';
import { Roles } from 'src/roles/roles.decorator';
import { Token } from 'src/users/token.decorator';

@Controller('document')
@ApiTags('Документы')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  @Get('/years')
  getYear() {
    return this.documentService.getYears();
  }

  @Get('/counts')
  getCounts(@UserInfo() userInfo: AccessTokenRepresentationFull) {
    return this.documentService.getCounts(userInfo);
  }

  @UserMapping<Delegation, DocumentReport>(['toId', 'fromId'], 'delegations')
  @Get('/report/in/:year')
  documentReportIn(
    @UserInfo() userInfo: AccessTokenRepresentationFull,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.documentService.getDocumentsReport(true, userInfo, year);
  }

  @UserMapping<Delegation, DocumentReport>(['toId', 'fromId'], 'delegations')
  @Get('/report/out/:year')
  documentReportOut(
    @UserInfo() userInfo: AccessTokenRepresentationFull,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.documentService.getDocumentsReport(false, userInfo, year);
  }

  @UserMapping<Delegation, DocumentReport>(['toId', 'fromId'], 'delegations')
  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @UserMapping<Delegation, DocumentReport>(['toId', 'fromId'], 'delegations')
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.documentService.findOne(+id, userInfo);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.deleteAndClearParentId(+id);
  }

  @Roles(['Manager'])
  @Post('/stamp/:id')
  signDocument(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
  ) {
    return this.documentService.signDocument(id, userInfo);
  }

  @Roles(['Manager', 'Initier'])
  @Post('/toggle-completed/:id')
  toggleCompleted(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.toggleCompleted(id);
  }

  @Post('/set-readed/:id')
  setReaded(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
    @Token() token: string,
  ) {
    return this.documentService.setDocumentReaded(id, userInfo, token);
  }

  @Post('/set-without-answer/:id')
  setWithoutAnswer(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() userInfo: AccessTokenRepresentationFull,
    @Token() token: string,
  ) {
    return this.documentService.setDocumentReaded(id, userInfo, token, true);
  }

  @Roles(['Initier'])
  @Post('/register/:id')
  register(@Param('id', ParseIntPipe) id: number, @Token() token: string) {
    return this.documentService.registerDocument(id, token);
  }

  @Post('/external-regnumber/:id')
  addExternalRegnumber(
    @Param('id', ParseIntPipe) id: number,
    @Token() token: string,
  ) {
    return this.documentService.addExternalRegnumber(id, token);
  }

  @Roles(['Initier'])
  @Post('/copy/:id')
  createDocumentCopy(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.createCopy(id);
  }
}
