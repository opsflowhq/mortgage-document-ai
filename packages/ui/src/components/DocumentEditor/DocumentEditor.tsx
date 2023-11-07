import Link from "next/link";

import EditorEntity from "./EditorEntity";
import LoadingIndicator from "./LoadingIndicator";


import Button from "../UI/Button";
import DocumentEditorHeader from "./DocumentEditorHeader";
import { useDocumentContext } from "../DocumentProvider";

import ArrowUpRight from "@/assets/images/icons/arrow-up-right";
import DocumentEditorFooter from "./DocumentEditorFooter";




export default function DocumentEditor() {

    const {
        documentModel,
        documentData,
        documentMeta,
        isLoading,
        isDocumentProcessing,
        isGeneratingJSON,
        onViewJSON } = useDocumentContext();



    return (
        <div className="h-screen shadow-2xl flex flex-col relative text-sm z-10">

            <DocumentEditorHeader
                isLoading={isLoading}
                documentMeta={documentMeta}
            />

            {isDocumentProcessing && <LoadingIndicator />}
            <div className="grow overflow-scroll relative">
                {
                    Object.keys(documentModel).map(entityKey => {
                        const entityModel = documentModel[entityKey];
                        const entityData = documentData ? documentData[entityKey] : undefined;

                        return (
                            <EditorEntity
                                key={entityKey}
                                entityKey={entityKey}
                                label={entityModel.label}
                                fieldsModel={entityModel.fields}
                                fieldsValue={entityData}
                            />
                        );
                    })
                }
            </div>

            <DocumentEditorFooter
                isDataLoading={isLoading}
                isGeneratingJSON={isGeneratingJSON}
                onViewJson={onViewJSON}
            />
        </div>
    );
}