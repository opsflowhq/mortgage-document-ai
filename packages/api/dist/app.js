"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const documentai_1 = require("@google-cloud/documentai");
const fs_1 = require("fs");
const pdf_lib_1 = require("pdf-lib");
const types_1 = require("@urla1003/types");
const documentAiClient = new documentai_1.DocumentProcessorServiceClient();
const processorName = "projects/614556138526/locations/us/processors/a596e4ceda5829e";
const datasetName = "projects/614556138526/locations/us/processors/a596e4ceda5829e/dataset/datasetSchema";
const documentServiceClient = new documentai_1.v1beta3.DocumentServiceClient();
const app = (0, express_1.default)();
const port = 3001;
const storage = multer_1.default.memoryStorage(); // Store the file in memory
const upload = (0, multer_1.default)({ storage: storage });
app.use((0, cors_1.default)({ origin: ["https://demo.mortgageflow.io", "http://localhost:3000"] }));
app.post("/document/process", upload.single("document"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadedFile = req.file;
    if (!uploadedFile)
        throw new Error("File upload error");
    console.log({ uploadedFile });
    //Prepare file
    const pdfFile = yield pdf_lib_1.PDFDocument.load(uploadedFile.buffer);
    const numberOfPages = pdfFile.getPages().length;
    const subFile = yield pdf_lib_1.PDFDocument.create();
    // Create a new "sub" document
    for (let i = 0; i < numberOfPages && i < 3; i++) {
        // copy the page at current index
        const [copiedPage] = yield subFile.copyPages(pdfFile, [i]);
        subFile.addPage(copiedPage);
    }
    const subFileBase64 = yield subFile.saveAsBase64();
    //Take into a different function
    const [result] = yield documentAiClient.processDocument({
        name: processorName,
        rawDocument: {
            content: subFileBase64,
            mimeType: uploadedFile.mimetype,
        }
    });
    let { document } = result;
    if (!document)
        throw new Error("Document parsing failed");
    //TODO: Replace with the Google Cloud
    yield fs_1.promises.writeFile("../../static/parsed.json", JSON.stringify(document));
    // const file = await fs.readFile("../../static/parsed.json", "utf-8");
    // const document = JSON.parse(file) as google.cloud.documentai.v1.IDocument;
    // console.log(document);
    const entities = document === null || document === void 0 ? void 0 : document.entities;
    if (!entities)
        throw new Error("Document parsing failed");
    //TODO: Extract into separate function
    const cleanEntities = entities.map((e) => getFieldFromEntity(e));
    for (const entity of entities) {
        // const key = entity.type as Form1003.FieldId | undefined;
        // const value = getFieldFromEntity(entity);
        // if (!key) continue;
        // const textValue = entity.mentionText;
        // const conf = entity.confidence ? entity.confidence * 100 : 0;
        // const pageRefs = entity?.pageAnchor?.pageRefs
        //   ? entity?.pageAnchor?.pageRefs
        //   : null;
        // const pageAnchor: PageAnchor[] | undefined = pageRefs?.map((pref) => {
        //   const boundingPoly = [];
        //   if (pref.boundingPoly?.normalizedVertices) {
        //     for (const v of pref.boundingPoly?.normalizedVertices) {
        //       if (v.x && v.y) boundingPoly.push({ x: v.x, y: v.y });
        //     }
        //   }
        //   return {
        //     page: pref.page ? pref.page : 0,
        //     boundingPoly: boundingPoly,
        //   };
        // });
        // // if (pageRef && pageRef.boundingPoly?.vertices) {
        // //   pageAnchor = [];
        // //   for (const v of pageRef.boundingPoly?.vertices) {
        // //     if (v.x && v.y) pageAnchor.push({x: v.x, y: v.y});
        // //   }
        // // }
        // flatForm1003FieldMap[key] = {
        //   value: textValue ? textValue : null,
        //   confidence: conf,
        //   pageAnchor,
        // };
    }
    //TODO: Extract into separate function
    const documentData = {};
    const documentModel = types_1.Form1003.documentModel;
    const documentModelEntityKeys = Object.keys(documentModel);
    for (const entityModelKey of documentModelEntityKeys) {
        const entityModel = documentModel[entityModelKey];
        const entityFieldsModel = entityModel.fields;
        // //TODO: Update type
        // let properties: { [key: string]: DocumentFieldValue | DocumentEntityData[] } = {};
        // for (const fieldKey of Object.keys(entityFieldsModel)) {
        //     const fieldModel = entityFieldsModel[fieldKey];
        //     //Rewrite to the filter if Array
        //     let fieldValue;
        //     if (!fieldModel.isArray)
        //         fieldValue = entities.find((e) => e.type === fieldModel.key);
        //     else {
        //         fieldValue = entities.filter(e => e.type === fieldModel.key)
        //         const { objectModel } = fieldModel;
        //         if (objectModel) {
        //             fieldValue = fieldValue.map(v => {
        //                 const nestedObject: { [key: string]: google.cloud.documentai.v1.Document.IEntity } = {};
        //                 for (const nestedObjectKey of Object.keys(objectModel)) {
        //                     const ent = v.properties?.find(e => e.type === objectModel[nestedObjectKey]);
        //                     if (ent) nestedObject[nestedObjectKey] = ent;
        //                 }
        //                 return nestedObject;
        //             });
        //         }
        //     }
        //     //@ts-ignore
        //     if (fieldValue) properties[fieldKey] = fieldValue;
        // }
        documentData[entityModelKey] = mapEntitiesToModel(entityFieldsModel, entities);
    }
    if (!document.pages)
        throw new Error("");
    const cleanedPages = document.pages.map((p) => {
        return {
            pageNumber: p.pageNumber ? p.pageNumber : 0,
            image: p.image, //TODO: refactor to check page.image on undefined
        };
    });
    console.log(uploadedFile);
    const resultDocument = {
        pages: cleanedPages,
        data: documentData,
        meta: {
            type: "Form 1003",
            sourceFileName: uploadedFile.originalname,
        },
    };
    res.json(resultDocument);
}));
const mapEntitiesToModel = (entityFieldsModel, entities) => {
    //TODO: Update type
    let properties = {};
    for (const fieldKey of Object.keys(entityFieldsModel)) {
        const fieldModel = entityFieldsModel[fieldKey];
        const nestedFieldModel = fieldModel.fields;
        const filteredEntities = entities.filter(e => e.type === fieldModel.key);
        // if (nestedFieldModel) {
        //     properties[fieldKey] =;
        //     continue;
        // }
        let fieldValue;
        if (nestedFieldModel)
            fieldValue = filteredEntities.map(e => mapEntitiesToModel(nestedFieldModel, e.properties || []));
        else
            fieldValue = filteredEntities.map(e => getFieldFromEntity(e));
        // filteredEntities.map(e => {
        //     if (nestedFieldModel) return mapEntitiesToModel(nestedFieldModel, filteredEntities);
        //     return getFieldFromEntity(e)
        // });
        if (!fieldModel.isArray)
            fieldValue = fieldValue[0];
        // //Rewrite to the filter if Array
        // let fieldValue;
        // if (!fieldModel.isArray) {
        //     fieldValue = entities.find((e) => e.type === fieldModel.key);
        //     fieldValue = fieldValue && getFieldFromEntity(fieldValue);
        // }
        // else {
        //     fieldValue = entities.filter(e => e.type === fieldModel.key).map(e => getFieldFromEntity(e))
        // }
        if (fieldValue)
            properties[fieldKey] = fieldValue;
    }
    return properties;
};
//Rewrite to get nested fields
//@ts-ignore
const getFieldFromEntity = (entity) => {
    var _a, _b;
    const textValue = entity.mentionText;
    const conf = entity.confidence ? entity.confidence * 100 : 0;
    const pageRefs = ((_a = entity === null || entity === void 0 ? void 0 : entity.pageAnchor) === null || _a === void 0 ? void 0 : _a.pageRefs)
        ? (_b = entity === null || entity === void 0 ? void 0 : entity.pageAnchor) === null || _b === void 0 ? void 0 : _b.pageRefs
        : null;
    const pageAnchor = pageRefs === null || pageRefs === void 0 ? void 0 : pageRefs.map((pref) => {
        var _a, _b;
        const boundingPoly = [];
        if ((_a = pref.boundingPoly) === null || _a === void 0 ? void 0 : _a.normalizedVertices) {
            for (const v of (_b = pref.boundingPoly) === null || _b === void 0 ? void 0 : _b.normalizedVertices) {
                if (v.x && v.y)
                    boundingPoly.push({ x: v.x, y: v.y });
            }
        }
        return {
            page: pref.page ? pref.page : 0,
            boundingPoly: boundingPoly,
        };
    });
    // if (pageRef && pageRef.boundingPoly?.vertices) {
    //   pageAnchor = [];
    //   for (const v of pageRef.boundingPoly?.vertices) {
    //     if (v.x && v.y) pageAnchor.push({x: v.x, y: v.y});
    //   }
    // }
    return {
        value: textValue ? textValue : null,
        confidence: conf,
        pageAnchor,
    };
};
// const getEntity = (entityId: string, entities: google.cloud.documentai.v1.Document.IEntity[]) => {
//   for (const entity of entities) {
//     const key = entity.type as Form1003.FieldId | undefined;
//     if (!key) continue;
//     const textValue = entity.mentionText;
//     const conf = entity.confidence ? entity.confidence * 100 : 0;
//     const pageRefs = entity?.pageAnchor?.pageRefs
//       ? entity?.pageAnchor?.pageRefs
//       : null;
//     const pageAnchor: PageAnchor[] | undefined = pageRefs?.map((pref) => {
//       const boundingPoly = [];
//       if (pref.boundingPoly?.normalizedVertices) {
//         for (const v of pref.boundingPoly?.normalizedVertices) {
//           if (v.x && v.y) boundingPoly.push({ x: v.x, y: v.y });
//         }
//       }
//       return {
//         page: pref.page ? pref.page : 0,
//         boundingPoly: boundingPoly,
//       };
//     });
//     // if (pageRef && pageRef.boundingPoly?.vertices) {
//     //   pageAnchor = [];
//     //   for (const v of pageRef.boundingPoly?.vertices) {
//     //     if (v.x && v.y) pageAnchor.push({x: v.x, y: v.y});
//     //   }
//     // }
//     flatForm1003FieldMap[key] = {
//       value: textValue ? textValue : null,
//       confidence: conf,
//       pageAnchor,
//     };
//   }
// };
const generateTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [result] = yield documentServiceClient.getDatasetSchema({
        name: datasetName,
        visibleFieldsOnly: true,
    });
    const { documentSchema } = result;
    const fields = (_a = documentSchema === null || documentSchema === void 0 ? void 0 : documentSchema.entityTypes) === null || _a === void 0 ? void 0 : _a.map((entityType) => entityType.properties).flat().filter((f) => { var _a; return ((_a = f === null || f === void 0 ? void 0 : f.propertyMetadata) === null || _a === void 0 ? void 0 : _a.inactive) === false; });
    if (!fields)
        throw new Error("No fields in the schema");
    // console.log(fields);
    // // const documentJson = await fs.readFile('../../static/parsed.json', 'utf-8');
    // // const document = JSON.parse(documentJson) as google.cloud.documentai.v1.IDocument;
    // // const entities = document?.entities;
    // if (!entities) throw new Error("Document parsing failed");
    // const keys = [...new Set(entities.map(e => e.type))].filter(k => k) as string[];
    const output = [];
    const enumName = "Field";
    output.push(`enum ${enumName} {`);
    const enumValues = fields.map((field) => { var _a; return `"${(_a = field === null || field === void 0 ? void 0 : field.name) === null || _a === void 0 ? void 0 : _a.toUpperCase()}" = "${field === null || field === void 0 ? void 0 : field.name}",`; });
    output.push(...enumValues);
    output.push(`}`);
    console.log(output.join("\n"));
});
// generateTypes();
app.use(express_1.default.static("public"));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
