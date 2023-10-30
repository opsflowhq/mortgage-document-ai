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
const types_1 = require("@urla1003/types");
const documentAiClient = new documentai_1.DocumentProcessorServiceClient();
const processorName = "projects/614556138526/locations/us/processors/a596e4ceda5829e";
const filePath = "../../static/urla_borrower_information.pdf";
const app = (0, express_1.default)();
const port = 3001;
const storage = multer_1.default.memoryStorage(); // Store the file in memory
const upload = (0, multer_1.default)({ storage: storage });
app.use((0, cors_1.default)());
app.post("/document/process", upload.single('document'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const uploadedFile = req.file;
    if (!uploadedFile)
        throw new Error('File upload error');
    // console.log({uploadedFile})
    // const [result] = await documentAiClient.processDocument({
    //   name: processorName,
    //   rawDocument: {
    //     content: uploadedFile.buffer.toString('base64'),
    //     mimeType: uploadedFile.mimetype,
    //   },
    // });
    // let { document } = result;
    // if(!document) throw new Error("Document parsing failed");
    const documentJson = yield fs_1.promises.readFile('../../static/parsed.json', 'utf-8');
    const document = JSON.parse(documentJson);
    const entities = document === null || document === void 0 ? void 0 : document.entities;
    if (!entities)
        throw new Error("Document parsing failed");
    //TODO: Extract into separate function
    const flatForm1003FieldMap = {};
    for (const entity of entities) {
        const key = entity.type;
        if (!key)
            continue;
        const textValue = entity.mentionText;
        const conf = entity.confidence ? entity.confidence * 100 : 0;
        const pageRefs = ((_a = entity === null || entity === void 0 ? void 0 : entity.pageAnchor) === null || _a === void 0 ? void 0 : _a.pageRefs) ? (_b = entity === null || entity === void 0 ? void 0 : entity.pageAnchor) === null || _b === void 0 ? void 0 : _b.pageRefs : null;
        const pageAnchor = pageRefs === null || pageRefs === void 0 ? void 0 : pageRefs.map(pref => {
            var _a, _b;
            const boundingPoly = [];
            if ((_a = pref.boundingPoly) === null || _a === void 0 ? void 0 : _a.normalizedVertices)
                for (const v of (_b = pref.boundingPoly) === null || _b === void 0 ? void 0 : _b.normalizedVertices) {
                    if (v.x && v.y)
                        boundingPoly.push({ x: v.x, y: v.y });
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
        };
    }
    //TODO: Extract into separate function
    const newMappedEntity = {};
    const form1003Map = types_1.Form1003.documentModel;
    const form1003Keys = Object.keys(form1003Map);
    for (const key of form1003Keys) {
        const entity = form1003Map[key];
        const entityFieldsMeta = entity.fields;
        // newMappedEntity[key] = {};
        let properties = {};
        for (const fieldKey of Object.keys(entityFieldsMeta)) {
            const fieldMeta = entityFieldsMeta[fieldKey];
            const fieldValue = flatForm1003FieldMap[fieldMeta.key];
            if (fieldValue)
                properties[fieldKey] = fieldValue;
        }
        newMappedEntity[key] = properties;
    }
    if (!document.pages)
        throw new Error("");
    const cleanedPages = document.pages.map(p => {
        return {
            pageNumber: p.pageNumber ? p.pageNumber : 0,
            image: p.image, //TODO: refactor to check page.image on undefined
        };
    });
    console.log(uploadedFile);
    const resultDocument = {
        pages: cleanedPages,
        data: newMappedEntity,
        meta: {
            type: 'Form 1003',
            sourceFileName: uploadedFile.originalname
        }
    };
    res.json(resultDocument);
}));
const generateTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const documentJson = yield fs_1.promises.readFile('../../static/parsed.json', 'utf-8');
    const document = JSON.parse(documentJson);
    const entities = document === null || document === void 0 ? void 0 : document.entities;
    if (!entities)
        throw new Error("Document parsing failed");
    const keys = [...new Set(entities.map(e => e.type))].filter(k => !k);
    const output = [];
    const enumName = "Field";
    output.push(`enum ${enumName} {`);
    const enumValues = keys.map(key => `${key.toUpperCase()} = "${key}",`);
    output.push(...enumValues);
    output.push(`}`);
    console.log(output.join('\n'));
});
// generateTypes();
app.use(express_1.default.static('public'));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
