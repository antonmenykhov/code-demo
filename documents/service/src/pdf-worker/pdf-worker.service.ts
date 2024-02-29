import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { PDFDocument, BlendMode, rgb } from 'pdf-lib';
@Injectable()
export class PdfWorkerService {
  async addHasReaded(
    filePath: string,
    signPdf: ArrayBuffer,
    needInsertPage: boolean,
    marksCount: number,
  ) {
    while (marksCount >= 8) {
      marksCount -= 8;
    }
    const file = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(file);
    const page = needInsertPage
      ? pdfDoc.insertPage(pdfDoc.getPageCount())
      : pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    const signPdfFile = await PDFDocument.load(signPdf);
    const preamble = await pdfDoc.embedPage(signPdfFile.getPage(0), {
      left: 0,
      bottom: signPdfFile.getPage(0).getHeight() - 130,
      right: signPdfFile.getPage(0).getWidth(),
      top: signPdfFile.getPage(0).getHeight(),
    });
    page.drawPage(preamble, {
      x: 0,
      y: page.getHeight() - 280 - 70 * marksCount,
      blendMode: BlendMode.Multiply,
    });
    await writeFile(filePath, await pdfDoc.save());
  }

  async addHasDone(filePath: string, signPdf: ArrayBuffer) {
    const file = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(file);
    const page = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    const signPdfFile = await PDFDocument.load(signPdf);
    const preamble = await pdfDoc.embedPage(signPdfFile.getPage(0), {
      left: 0,
      bottom: signPdfFile.getPage(0).getHeight() - 130,
      right: signPdfFile.getPage(0).getWidth(),
      top: signPdfFile.getPage(0).getHeight(),
    });
    page.drawPage(preamble, {
      x: 0,
      y: page.getHeight() - 210,
      blendMode: BlendMode.Multiply,
    });
    await writeFile(filePath, await pdfDoc.save());
  }

  async addRegnumber(
    filePath: string,
    signPdf: ArrayBuffer,
    needInsertPage: boolean,
  ) {
    const file = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(file);
    const page = needInsertPage
      ? pdfDoc.insertPage(pdfDoc.getPageCount())
      : pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    const signPdfFile = await PDFDocument.load(signPdf);
    const preamble = await pdfDoc.embedPage(signPdfFile.getPage(0), {
      left: 0,
      bottom: signPdfFile.getPage(0).getHeight() - 145,
      right: signPdfFile.getPage(0).getWidth(),
      top: signPdfFile.getPage(0).getHeight(),
    });
    page.drawPage(preamble, {
      x: 0,
      y: page.getHeight() - 145,
      blendMode: BlendMode.Multiply,
    });
    await writeFile(filePath, await pdfDoc.save());
  }

  async addReciept(
    filePath: string,
    signPdf: ArrayBuffer,
    needInsertPage: boolean,
  ) {
    const file = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(file);
    const page = needInsertPage
      ? pdfDoc.insertPage(pdfDoc.getPageCount())
      : pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    const signPdfFile = await PDFDocument.load(signPdf);
    const preamble = await pdfDoc.embedPage(signPdfFile.getPage(0));
    page.drawPage(preamble);
    await writeFile(filePath, await pdfDoc.save());
  }

  async mergePDFDocuments(documents: ArrayBuffer[]) {
    const mergedPdf = await PDFDocument.create();

    for await (const document of documents) {
      const currentDocument = await PDFDocument.load(document);
      const copiedPages = await mergedPdf.copyPages(
        currentDocument,
        currentDocument.getPageIndices(),
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return await mergedPdf.save();
  }
}
