import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";
import { parseManuscript, generatePrintablePDF, generateDigitalPDF } from "../utils/bookProcessor";
import { analyzeManuscriptContent } from "../utilidades/aiAgent";
import OpenAI from "openai";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

const handler = nextConnect();

handler.use(upload.single("manuscript"));

handler.post(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const fileType = path.extname(req.file.originalname).toLowerCase().replace(".", "");

    // Parse manuscript text
    const manuscriptText = await parseManuscript(fileBuffer, fileType);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Analyze manuscript with AI agent
    const analysis = await analyzeManuscriptContent(openai, manuscriptText);

    // Extract info for PDF generation
    const title = analysis.titulo || "Libro Mágico";
    const author = analysis.autor || "Autor Desconocido";

    // Generate PDFs
    const printablePdfBytes = await generatePrintablePDF(title, author, manuscriptText);
    const digitalPdfBytes = await generateDigitalPDF(title, author, manuscriptText);

    // Save PDFs to disk or cloud storage (for MVP, save locally)
    const outputDir = path.resolve("./public/generated");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const printablePath = path.join(outputDir, `${Date.now()}_printable.pdf`);
    const digitalPath = path.join(outputDir, `${Date.now()}_digital.pdf`);

    fs.writeFileSync(printablePath, printablePdfBytes);
    fs.writeFileSync(digitalPath, digitalPdfBytes);

    // Return download URLs (assuming public folder is served)
    const baseUrl = process.env.BASE_URL || "";
    res.status(200).json({
      message: "PDFs generated successfully",
      printableUrl: `${baseUrl}/generated/${path.basename(printablePath)}`,
      digitalUrl: `${baseUrl}/generated/${path.basename(digitalPath)}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Error processing manuscript" });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
