import DocumentPage from "./DocumentPage";
import { FormFieldValue, NestedFormFieldsMap, Page } from "@urla1003/types";
import { FC } from "react";


interface DocumentViewerProps {
    isLoading: boolean,
    pages?: Page[],
    fields?: NestedFormFieldsMap,
}

export default function DocumentViewer({pages, fields}: DocumentViewerProps) {
    // console.log("pages >", pages)
    // console.log('fields', fields);
    const flatFields: FormFieldValue[] = [];

    for (const entityKey in fields) {
        const entity = fields[entityKey];

        for (const fieldKey in entity) {
            flatFields.push(entity[fieldKey])
        }
    }

    // console.log(flatFields);




    return (
        <div className="bg-gray-300 h-full w-full p-20">
            {pages?.map((p, i) => {

                const fields = flatFields.filter(f => f.pageAnchor?.some(pa => pa.page == i));

                return (
                    <DocumentPage 
                        key={p.pageNumber} 
                        page={p}
                        fields={fields}
                    />
                );
            })}
        </div>
    );
}