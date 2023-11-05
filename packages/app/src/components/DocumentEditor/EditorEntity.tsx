import { DocumentEntityData, DocumentFieldValue, Form1003 } from "@urla1003/types";
import EditorField from "./EditorField";
import { FieldHoverEvent } from "../DocumentViewer/BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";


interface EditorEntityProps {
    label: string;
    entityKey: string;
    fieldsModel: Form1003.DocumentEntityFieldsModel;
    fieldsValue?: DocumentEntityData;
    // hoveredField: FieldHoverEvent | null;
    // field
}

export default function DocumentEntity({ fieldsModel, fieldsValue, entityKey, label }: EditorEntityProps) {


    const { hoveredField, setHoveredField, isLoading } = useDocumentContext();

    return (
        <div className="bg-white border-b pt-4">
            <div className="flex items-center px-4">
                <h3 className="font-bold text-base">{label}</h3>
            </div>
            <div>
                {Object.keys(fieldsModel).map(fieldKey => {
                    const fieldModel = fieldsModel[fieldKey];
                    const field = fieldsValue ? fieldsValue[fieldKey] : undefined;

                    // let value =  field?.value;
                    // let confidence = 

                    // turn otherIncome.sources.1.sourceName into otherIncome.sources and then compare
                    // Editor doesn't support yet nested fields
                    const parentHoveredField = hoveredField?.split('.').slice(0, 2).join('.');
                    const isHovered = parentHoveredField === `${entityKey}.${fieldKey}`;

                    return (
                        <EditorField
                            key={`${entityKey}.${fieldKey}`}
                            label={fieldModel.label}
                            field={field}
                            // value={value}
                            // confidence={fieldValue?.confidence}
                            isHovering={isHovered}
                            isLoading={isLoading}
                            isEditing={false} //for future iteration
                            onMouseEnter={() => {
                                if (!isLoading) setHoveredField(`${entityKey}.${fieldKey}`);
                            }}
                            onMouseLeave={() => setHoveredField(null)}
                        />
                    );
                })}
            </div>
        </div>
    );
}