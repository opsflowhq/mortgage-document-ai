import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

import {
    DocumentProcessorServiceClient,
    v1beta3,
} from "@google-cloud/documentai";
import { promises as fs } from "fs";
import { google } from "@google-cloud/documentai/build/protos/protos";

import { PDFDocument } from 'pdf-lib';

import {
    DocumentData,
    DocumentEntityData,
    DocumentFieldValue,
    Form1003,
    Page,
    PageAnchor,
    Point,
    ProcessedDocument,
} from "@mortgage-document-ai/models";

const documentAiClient = new DocumentProcessorServiceClient();
const processorName =
    "projects/614556138526/locations/us/processors/a596e4ceda5829e";
const datasetName =
    "projects/614556138526/locations/us/processors/a596e4ceda5829e/dataset/datasetSchema";

const documentServiceClient = new v1beta3.DocumentServiceClient();

const app = express();
const port = 3001;

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

app.use(
    cors({ origin: ["https://demo.mortgageflow.io", "http://localhost:3000"] }),
);

app.post("/document/process", upload.single("document"), async (req, res) => {
    const uploadedFile = req.file;
    if (!uploadedFile) throw new Error("File upload error");

    console.log('Start processing file >>', uploadedFile);

    //Prepare file
    const pdfFile = await PDFDocument.load(uploadedFile.buffer);
    const numberOfPages = pdfFile.getPages().length;
    const subFile = await PDFDocument.create();

    // Create a new "sub" document
    for (let i = 0; i < numberOfPages && i < 3; i++) {

        // copy the page at current index
        const [copiedPage] = await subFile.copyPages(pdfFile, [i])
        subFile.addPage(copiedPage);
    }

    const subFileBase64 = await subFile.saveAsBase64();

    //Take into a different function
    const [result] = await documentAiClient.processDocument({
        name: processorName,
        rawDocument: {
            content: subFileBase64,
            mimeType: uploadedFile.mimetype,
        }
    });

    let { document } = result;

    if (!document) throw new Error("Document parsing failed");

    const entities = document?.entities;
    if (!entities) throw new Error("Document parsing failed");



    //TODO: Extract into separate function
    const documentData: DocumentData = {};
    const documentModel = Form1003.documentModel;
    const documentModelEntityKeys = Object.keys(documentModel);

    for (const entityModelKey of documentModelEntityKeys) {
        const entityModel = documentModel[entityModelKey];
        const entityFieldsModel = entityModel.fields;

        documentData[entityModelKey] = mapEntitiesToModel(entityFieldsModel, entities);
    }

    if (!document.pages) throw new Error("");

    const cleanedPages = document.pages.map((p) => {
        return {
            pageNumber: p.pageNumber ? p.pageNumber : 0,
            image: p.image as Page["image"], //TODO: refactor to check page.image on undefined
        };
    });

    const resultDocument: ProcessedDocument = {
        pages: cleanedPages,
        data: documentData,
        meta: {
            type: "Form 1003",
            sourceFileName: uploadedFile.originalname,
        },
    };

    res.json(resultDocument);
});


const mapEntitiesToModel = (entityFieldsModel: Form1003.DocumentEntityFieldsModel, entities: google.cloud.documentai.v1.Document.IEntity[]) => {
    //TODO: Update type
    let properties: DocumentEntityData = {};

    for (const fieldKey of Object.keys(entityFieldsModel)) {
        const fieldModel = entityFieldsModel[fieldKey];
        const nestedFieldModel = fieldModel.fields;
        const filteredEntities = entities.filter(e => e.type === fieldModel.key);

        let fieldValue;

        if (nestedFieldModel)
            fieldValue = filteredEntities.map(e => mapEntitiesToModel(nestedFieldModel, e.properties || []));
        else
            fieldValue = filteredEntities.map(e => getFieldFromEntity(e))


        if (!fieldModel.isArray) fieldValue = fieldValue[0];


        if (fieldValue) properties[fieldKey] = fieldValue;
    }

    return properties;
}


const getFieldFromEntity = (entity: google.cloud.documentai.v1.Document.IEntity): DocumentFieldValue => {
    const textValue = entity.mentionText;
    const conf = entity.confidence ? entity.confidence * 100 : 0;

    const pageRefs = entity?.pageAnchor?.pageRefs
        ? entity?.pageAnchor?.pageRefs
        : null;

    const pageAnchor: PageAnchor[] | undefined = pageRefs?.map((pref) => {
        const boundingPoly = [];

        if (pref.boundingPoly?.normalizedVertices) {
            for (const v of pref.boundingPoly?.normalizedVertices) {
                if (v.x && v.y) boundingPoly.push({ x: v.x, y: v.y });
            }
        }

        return {
            page: pref.page ? pref.page : 0,
            boundingPoly: boundingPoly,
        };
    });


    return {
        value: textValue ? textValue : null,
        confidence: conf,
        pageAnchor,
    };
};



const generateTypes = async () => {
    const [result] = await documentServiceClient.getDatasetSchema({
        name: datasetName,
        visibleFieldsOnly: true,
    });

    const { documentSchema } = result;
    const fields = documentSchema?.entityTypes?.map((entityType) =>
        entityType.properties
    ).flat().filter((f) => f?.propertyMetadata?.inactive === false);

    if (!fields) throw new Error("No fields in the schema");

    const output: string[] = [];
    const enumName = "Fields";

    output.push(`enum ${enumName} {`);

    const enumValues = fields.map((field) =>
        `"${field?.name?.toUpperCase()}" = "${field?.name}",`
    );
    output.push(...enumValues);

    output.push(`}`);

    console.log(output.join("\n"));
};


app.use(express.static("public"));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
