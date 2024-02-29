import { Injectable } from '@nestjs/common';
import { convert } from 'libreoffice-convert';
import { promisify } from 'util';
import { generatePdf } from 'html-pdf-node';

const convertAsync = promisify(convert);
const generatePdfAsync = promisify(generatePdf);
@Injectable()
export class AttachmentTransformerService {
  async transformHtmlToPdf(
    htmlContent: Buffer | string,
    footerTemplate?: Buffer | string,
  ) {
    return await generatePdfAsync(
      {
        content: Buffer.isBuffer(htmlContent)
          ? htmlContent.toString('utf-8')
          : htmlContent,
      },
      {
        margin: {
          top: 48,
          right: 60,
          bottom: footerTemplate ? 60 : 48,
          left: 90,
        },
        format: 'A4',
        headerTemplate: '   ',
        footerTemplate: Buffer.isBuffer(footerTemplate)
          ? footerTemplate?.toString('utf-8')
          : footerTemplate,
        displayHeaderFooter: footerTemplate ? true : false,
      },
    );
  }

  async transformDocumentToPdf(file: Buffer): Promise<Buffer> {
    return await convertAsync(file, '.pdf', undefined);
  }
}
