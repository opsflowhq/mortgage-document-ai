import { LocalFile } from "@/types";
import { get, set } from "idb-keyval";

export const getLocalFile = async (fileStorageKey: string) => {
    return await get(fileStorageKey) as LocalFile;
}

export const setLocalFile = async (fileStorageKey: string, localFile: LocalFile) => {
    await set(fileStorageKey, localFile);
};

// export function flattenDocument(ob: DocumentData | DocumentFieldValueUnion) {

//     // The object which contains the
//     // final result
//     let result: FlatDocumentData = {};

//     // loop through the object "ob"
//     for (const i in ob) {

//         // We check the type of the i using
//         // typeof() function and recursively
//         // call the function again

//         //@ts-ignore
//         const nested = ob[i];
//         if ((typeof nested) === 'object' && !nested?.value) {

//             //@ts-ignore
//             const temp = flattenDocument(nested);
//             for (const j in temp) {

//                 // Store temp in result
//                 result[i + '.' + j] = temp[j];
//             }
//         }

//         // Else store ob[i] in result directly
//         else {

//             //@ts-ignore
//             result[i] = ob[i];
//         }
//     }
//     return result;
// };

// export function filterFlatDocumentByPage(flatDocumentData: FlatDocumentData, pageIndex: string | number) {
//     const flatPageData: FlatDocumentData = {};


//     for (const fieldKey in flatDocumentData) {
//         const field = flatDocumentData[fieldKey];
//         const isFieldOnThePage = field.pageAnchor?.some(pa => pa.page == pageIndex);
//         // const isEntityExistOnThePage = !!flatPageData[fieldKey];


//         if (isFieldOnThePage) {
//             // if (!isEntityExistOnThePage) flatPageData[fieldKey] = {};
//             flatPageData[fieldKey] = field;
//         }
//     }


//     return flatPageData;

// }

// export function getFieldModelByPath(documentModel: Form1003.DocumentModel, path: string) {
//     //Turn path: otherIncome.sources.1.monthlyIncome
//     //Into: otherIncome.fields.sources.fields.monthlyIncome
//     const adjustedPath = path.split('.').filter(segment => isNaN(+segment)).join('.fields.');
//     return getValueByPath(documentModel, adjustedPath) as Form1003.DocumentFieldModel | null;

// };

// export function isDocumentFieldValue(object: any): object is DocumentFieldValue {
//     return 'value' in object && 'confidence' in object;
// }

// export function documentEntityToString(documentEntityData: DocumentEntityData) {
//     const flatEntity = flattenDocument(documentEntityData);
//     return Object.keys(flatEntity).map(key => flatEntity[key].value).join(', ')
// }

// export function getAverageFieldConfidence(field: DocumentFieldValueUnion) {
//     const flatEntity = flattenDocument(field);
//     const fields = Object.keys(flatEntity);
//     const totalConfidenceSum = fields.reduce((prevValue, key, index) => prevValue + flatEntity[key].confidence, 0);
//     const totalFieldsCount = fields.length + 1;

//     return totalConfidenceSum / totalFieldsCount;
// }

// export function fieldToString(field: DocumentFieldValueUnion) {
//     let value: string | null = null;
//     if (Array.isArray(field))
//         value = field.map(f => isDocumentFieldValue(f) ? f.value : documentEntityToString(f)).join(' ');
//     else if (field)
//         value = isDocumentFieldValue(field) ? field.value : documentEntityToString(field);

//     return value;
// }

