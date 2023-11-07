import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { PDFDocument } from 'pdf-lib';

//Document models
import { documentTypes, ProcessedDocument } from "@mortgage-document-ai/models";
import { mapEntitiesToDocumentModel, mapPages } from '@mortgage-document-ai/models/utils'


const app = express();
const port = 3001;


app.use(cors({ origin: ["https://demo.mortgageflow.io", "http://localhost:3000"] }));


const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });
const documentAiClient = new DocumentProcessorServiceClient();

app.post("/document/process", upload.single("document"), async (req, res) => {
    const uploadedFile = req.file;
    if (!uploadedFile) throw new Error("File upload error");

    //Get document config
    const documentType = documentTypes.UrlaForm1003;

    console.log('Start processing file >>', uploadedFile);

    //Prepare file (slice first 3 pages of the file)
    const pdfFile = await PDFDocument.load(uploadedFile.buffer);
    const numberOfPages = pdfFile.getPages().length;
    const subFile = await PDFDocument.create();

    for (let i = 0; i < numberOfPages && i < 3; i++) {
        const [copiedPage] = await subFile.copyPages(pdfFile, [i])
        subFile.addPage(copiedPage);
    }

    const subFileBase64 = await subFile.saveAsBase64();


    // Process document
    const [result] = await documentAiClient.processDocument({
        name: documentType.processors[0].name,
        rawDocument: {
            content: subFileBase64,
            mimeType: uploadedFile.mimetype,
        }
    });

    let { document } = result;

    //Read local
    // const data = await fs.readFile('../../static/parsed.json', 'utf8');
    // const document = JSON.parse(data) as google.cloud.documentai.v1.Document;

    //Data check
    if (!document) throw new Error("Document parsing failed");
    if (!document.entities) throw new Error("Document parsing failed");
    if (!document.pages) throw new Error("No pages extracted");



    //Turn Document AI response into usable data
    const documentData = mapEntitiesToDocumentModel(documentType.model, document.entities);
    const documentPages = mapPages(document.pages);
    const documentMeta = {
        type: "Form 1003",
        sourceFileName: uploadedFile.originalname,
    };

    const resultDocument: ProcessedDocument = {
        pages: documentPages,
        data: documentData,
        meta: documentMeta,
    };

    res.json(resultDocument);
});










app.use(express.static("public"));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
