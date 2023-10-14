import { DocumentData, Form1003, Page } from "@urla1003/types";
import DocumentField from "./EditorField";
import EditorEntity from "./EditorEntity";


interface DocumentEditorProps {
    isLoading: boolean;
    documentModel: Form1003.DocumentModel; 
    documentData?: DocumentData;
}

export default function DocumentEditor({documentModel, documentData}: DocumentEditorProps) {
    
    // console.log('Data schema ->', documentModel);
    // console.log('Data ->', documentData);


    return (
        <div className="h-screen  shadow-2xl flex flex-col">
            <div className="h-20 border-b"></div>
            <div className="grow overflow-scroll">
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
            <div className="h-12 drop-shadow-2xl border-t flex justify-center items-center">
                Confirm
            </div>
            {/* <EditorEntity /> */}
            

        </div>
    );
}