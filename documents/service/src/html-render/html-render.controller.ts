import { Body, Controller, Post, Query, Render } from '@nestjs/common';
import { HtmlRenderService } from './html-render.service';
import { OutDocumentFormDto } from './dto/out-document-form.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegnumberDto } from './dto/regnumber.dto';
import { HasdoneDto } from './dto/hasdone.dto';
import { CompanyStampDto } from './dto/company-stamp.dto';
import { Token } from 'src/users/token.decorator';

@Controller()
@ApiTags('Рендер')
export class HtmlRenderController {
  constructor(private readonly htmlRenderService: HtmlRenderService) {}
  @Post('out-document')
  @Render('outdocument')
  renderOutDocument(@Body() outDocumentFormDto: OutDocumentFormDto) {
    return outDocumentFormDto;
  }

  @Post('company-stamp')
  @Render('company-stamp')
  renderCompanyStamp(@Body() outDocumentFormDto: CompanyStampDto) {
    return outDocumentFormDto;
  }

  @Post('sign')
  @Render('sign')
  renderSign(@Body() outDocumentFormDto: OutDocumentFormDto) {
    return outDocumentFormDto;
  }

  @Post('regnumber')
  @Render('regnumber')
  renderRegnumber(@Body() outDocumentFormDto: RegnumberDto) {
    return outDocumentFormDto;
  }

  @Post('hasdone')
  @Render('hasdone')
  hasdone(@Body() outDocumentFormDto: HasdoneDto) {
    return outDocumentFormDto;
  }

  @Post('worker-mark')
  @Render('worker-mark')
  workerMark(@Body() outDocumentFormDto: HasdoneDto) {
    return outDocumentFormDto;
  }

  @Post('outdocument-attachment')
  createOutDocumentAttachment(
    @Body() outDocumentFormDto: OutDocumentFormDto,
    @Token() token: string,
  ) {
    return this.htmlRenderService.createOutDocumentAttachment(
      outDocumentFormDto,
      token,
    );
  }
}
