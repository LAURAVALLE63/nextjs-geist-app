import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

/**
 * Parses manuscript content from .docx or .txt file buffer
 * @param {Buffer} fileBuffer
 * @param {string} fileType - 'docx' or 'txt'
 * @returns {Promise<string>} - extracted text content
 */
export async function parseManuscript(fileBuffer, fileType) {
  if (fileType === "docx") {
    // Use mammoth to extract text from docx buffer
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } else if (fileType === "txt") {
    return fileBuffer.toString("utf-8");
  } else {
    throw new Error("Unsupported file type");
  }
}

/**
 * Generates a printable PDF with interior design and cover page
 * @param {string} title
 * @param {string} author
 * @param {string} content
 * @returns {Promise<Uint8Array>} - PDF bytes
 */
export async function generatePrintablePDF(title, author, content) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Cover page
  const coverPage = pdfDoc.addPage();
  coverPage.drawText(title, {
    x: 50,
    y: 700,
    size: 30,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  coverPage.drawText(`Autor: ${author}`, {
    x: 50,
    y: 650,
    size: 20,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  // Interior pages (simple example, add design elements as needed)
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  const textWidth = width - 100;
  const lines = content.split("\n");

  let y = height - 50;
  for (const line of lines) {
    if (y < 50) {
      y = height - 50;
      pdfDoc.addPage();
    }
    page.drawText(line, {
      x: 50,
      y,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
      maxWidth: textWidth,
    });
    y -= fontSize + 5;
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Generates a digital PDF with interactive links
 * @param {string} title
 * @param {string} author
 * @param {string} content
 * @param {Array<{text: string, url: string}>} links
 * @returns {Promise<Uint8Array>} - PDF bytes
 */
export async function generateDigitalPDF(title, author, content, links = []) {
  // For simplicity, reuse generatePrintablePDF and add links if needed
  // Advanced implementation can add clickable links using pdf-lib annotations
  return generatePrintablePDF(title, author, content);
}
