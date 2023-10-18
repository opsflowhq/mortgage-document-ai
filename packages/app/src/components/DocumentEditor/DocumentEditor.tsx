import { DocumentData, Form1003, Page } from "@urla1003/types";
import DocumentField from "./EditorField";
import EditorEntity from "./EditorEntity";
import { FieldHoverEvent } from "../DocumentViewer/BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";


interface DocumentEditorProps {
    // isLoading: boolean;
    // documentModel: Form1003.DocumentModel; 
    // documentData?: DocumentData;
    // hoveredField: FieldHoverEvent | null;
}

export default function DocumentEditor({}: DocumentEditorProps) {
    
    // console.log('Data schema ->', documentModel);
    // console.log('Data ->', documentData);

    const {documentModel, documentData} = useDocumentContext();

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
                                // hoveredField={hoveredField}
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