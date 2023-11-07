import { google } from "@google-cloud/documentai/build/protos/protos"; import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { DocumentData, DocumentEntityData, DocumentEntityFieldsModel, DocumentFieldModel, DocumentFieldValue, DocumentFieldValueUnion, DocumentModel, FlatDocumentData, Page, PageAnchor, DocumentType } from "./index";
import getValueByPath from 'get-value';


export function flattenDocument(ob: DocumentData | DocumentFieldValueUnion) {

    // The object which contains the
    // final result
    let result: FlatDocumentData = {};

    // loop through the object "ob"
    for (const i in ob) {

        // We check the type of the i using
        // typeof() function and recursively
        // call the function again

        //@ts-ignore
        const nested = ob[i];
        if ((typeof nested) === 'object' && !nested?.value) {

            //@ts-ignore
            const temp = flattenDocument(nested);
            for (const j in temp) {

                // Store temp in result
                result[i + '.' + j] = temp[j];
            }
        }

        // Else store ob[i] in result directly
        else {

            //@ts-ignore
            result[i] = ob[i];
        }
    }
    return result;
};

export function filterFlatDocumentByPage(flatDocumentData: FlatDocumentData, pageIndex: string | number) {
    const flatPageData: FlatDocumentData = {};


    for (const fieldKey in flatDocumentData) {
        const field = flatDocumentData[fieldKey];
        const isFieldOnThePage = field.pageAnchor?.some(pa => pa.page == pageIndex);
        // const isEntityExistOnThePage = !!flatPageData[fieldKey];


        if (isFieldOnThePage) {
            // if (!isEntityExistOnThePage) flatPageData[fieldKey] = {};
            flatPageData[fieldKey] = field;
        }
    }


    return flatPageData;

}

export function getFieldModelByPath(documentModel: DocumentModel, path: string) {
    //Turn path: otherIncome.sources.1.monthlyIncome
    //Into: otherIncome.fields.sources.fields.monthlyIncome
    const adjustedPath = path.split('.').filter(segment => isNaN(+segment)).join('.fields.');
    return getValueByPath(documentModel, adjustedPath) as DocumentFieldModel | null;

};

export function isDocumentFieldValue(object: any): object is DocumentFieldValue {
    return 'value' in object && 'confidence' in object;
}

export function documentEntityToString(documentEntityData: DocumentEntityData) {
    const flatEntity = flattenDocument(documentEntityData);
    return Object.keys(flatEntity).map(key => flatEntity[key].value).join(', ')
}

export function getAverageFieldConfidence(field: DocumentFieldValueUnion) {
    const flatEntity = flattenDocument(field);
    const fields = Object.keys(flatEntity);
    const totalConfidenceSum = fields.reduce((prevValue, key, index) => prevValue + flatEntity[key].confidence, 0);
    const totalFieldsCount = fields.length + 1;

    return totalConfidenceSum / totalFieldsCount;
}

export function fieldToString(field: DocumentFieldValueUnion) {
    let value: string | null = null;
    if (Array.isArray(field))
        value = field.map(f => isDocumentFieldValue(f) ? f.value : documentEntityToString(f)).join(' ');
    else if (field)
        value = isDocumentFieldValue(field) ? field.value : documentEntityToString(field);

    return value;
}

export function getFieldFromEntity(entity: google.cloud.documentai.v1.Document.IEntity): DocumentFieldValue {
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

export function mapEntitiesToModel(entityFieldsModel: DocumentEntityFieldsModel, entities: google.cloud.documentai.v1.Document.IEntity[]) {
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

//TODO: Reactor and dombine with the mapEntitiesToModel
export function mapEntitiesToDocumentModel(documentModel: DocumentModel, entities: google.cloud.documentai.v1.Document.IEntity[]) {
    const documentData: DocumentData = {};
    const documentModelEntityKeys = Object.keys(documentModel);

    for (const entityModelKey of documentModelEntityKeys) {
        const entityModel = documentModel[entityModelKey];
        const entityFieldsModel = entityModel.fields;

        documentData[entityModelKey] = mapEntitiesToModel(entityFieldsModel, entities);
    }

    return documentData;
}


export function mapPages(pages: google.cloud.documentai.v1.Document.IPage[]) {
    const documentPages = pages.map((p) => {
        return {
            pageNumber: p.pageNumber ? p.pageNumber : 0,
            image: p.image as Page["image"], //TODO: refactor to check page.image on undefined
        };
    });
    return documentPages;
}
