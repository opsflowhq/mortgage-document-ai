import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import multer from 'multer';

import {DocumentProcessorServiceClient} from '@google-cloud/documentai';
import {promises as fs} from 'fs';
import { google } from '@google-cloud/documentai/build/protos/protos';

import {Form1003, DocumentData, PageAnchor, Point, ProcessedDocument, Page, DocumentFieldValue} from "@urla1003/types";

const documentAiClient = new DocumentProcessorServiceClient();
const processorName = "projects/614556138526/locations/us/processors/a596e4ceda5829e";
const filePath = "../../static/urla_borrower_information.pdf";

const app = express();
const port = 3001;

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

app.use(cors())

app.post("/document/process", upload.single('document'), async (req, res) => {

 
  // const uploadedFile = req.file;
  // if (!uploadedFile) throw new Error('File upload error');

  // const encodedPdfFile = Buffer.from(uploadedFile.buffer).toString('base64');


  // const [result] = await documentAiClient.processDocument({
  //   name: processorName,
  //   rawDocument: {
  //     content: encodedPdfFile,
  //     mimeType: 'application/pdf',
  //   },
  // });

  // let { document } = result;

  const documentJson = await fs.readFile('../../static/parsed.json', 'utf-8');
  const document = JSON.parse(documentJson) as google.cloud.documentai.v1.IDocument;


  const entities = document?.entities;
  if (!entities) throw new Error("Document parsing failed");


  //TODO: Extract into separate function
  const flatForm1003FieldMap: Partial<Form1003.FlatFormFieldsMap> = {};
  for (const entity of entities) {
    const key = entity.type as Form1003.FieldId | undefined;
    if (!key) continue;
   
    const textValue = entity.mentionText;
    const conf = entity.confidence ? entity.confidence * 100 : 0;

    const pageRefs = entity?.pageAnchor?.pageRefs ? entity?.pageAnchor?.pageRefs : null;

    const pageAnchor: PageAnchor[] | undefined = pageRefs?.map(pref => {
      const boundingPoly = [];

      if (pref.boundingPoly?.normalizedVertices) 
        for (const v of pref.boundingPoly?.normalizedVertices) {
            if (v.x && v.y) boundingPoly.push({x: v.x, y: v.y});
          }

      return {
        page: pref.page ? pref.page : 0,
        boundingPoly: boundingPoly
      };
    });

    // if (pageRef && pageRef.boundingPoly?.vertices) {
    //   pageAnchor = [];
    //   for (const v of pageRef.boundingPoly?.vertices) {
    //     if (v.x && v.y) pageAnchor.push({x: v.x, y: v.y});
    //   }
    // }

    flatForm1003FieldMap[key] = {
      value: textValue ? textValue : null,
      confidence: conf,
      pageAnchor,
    }
  }

  //TODO: Extract into separate function
  const newMappedEntity: DocumentData = {};
  const form1003Map = Form1003.documentModel;
  const form1003Keys = Object.keys(form1003Map);
  
  for (const key of form1003Keys) {
    const entity = form1003Map[key]
    const entityFieldsMeta = entity.fields;
    // newMappedEntity[key] = {};

    let properties: {[key: string]: DocumentFieldValue} = {};
    for (const fieldKey of Object.keys(entityFieldsMeta)) {
      const fieldMeta = entityFieldsMeta[fieldKey]; 
      const fieldValue = flatForm1003FieldMap[fieldMeta.key];
      if (fieldValue) properties[fieldKey] = fieldValue;
    }
    newMappedEntity[key] = properties;
  }

  if (!document.pages) throw new Error("");

  const cleanedPages = document.pages.map(p => {
    return {
      pageNumber: p.pageNumber ? p.pageNumber : 0,
      image: p.image as Page['image'], //TODO: refactor to check page.image on undefined
    }
  });
  
  const resultDocument: ProcessedDocument = {
    pages: cleanedPages,
    data: newMappedEntity,
  };

  res.json(resultDocument);
});

const generateTypes = async () => {
  const documentJson = await fs.readFile('../../static/parsed.json', 'utf-8');
  const document = JSON.parse(documentJson) as google.cloud.documentai.v1.IDocument;
  const entities = document?.entities;
  if (!entities) throw new Error("Document parsing failed");

  const keys = [...new Set(entities.map(e => e.type))].filter(k => !k) as string[];

  const output: string[] = [];
  const enumName = "Field";

  output.push(`enum ${enumName} {`);

  const enumValues = keys.map(key => `${key.toUpperCase()} = "${key}",`);
  output.push(...enumValues)

  output.push(`}`);


  console.log(output.join('\n'));
}

// generateTypes();

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


