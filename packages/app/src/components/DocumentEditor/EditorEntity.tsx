import { DocumentEntityData, DocumentFieldValue, Form1003 } from "@urla1003/types";
import DocumentField from "./EditorField";


interface EditorEntityProps {
    label: string;
    entityKey: string;
    fieldsModel: Form1003.DocumentEntityFieldsModel;
    fieldsValue?: DocumentEntityData;
    // field
}

export default function DocumentEntity({ fieldsModel, fieldsValue, entityKey, label }: EditorEntityProps) {
    // console.log('Entity Fields ->', fieldsModel);
    // console.log('Entity Field Values ->', fieldsValue);
    return (
        <div className="bg-white border-b pt-4">
            <div className="flex items-center h-12 px-4">
                <h3 className="font-bold">{label}</h3>
            </div>
            <div>
                {Object.keys(fieldsModel).map(fieldKey => {
                    const fieldModel = fieldsModel[fieldKey];
                    const fieldValue = fieldsValue ? fieldsValue[fieldKey] : undefined;
                    return (
                        <DocumentField
                            key={`${entityKey}.${fieldKey}`}
                            label={fieldModel.label}
                            value={fieldValue?.value}
                        />
                    );
                })}
            </div>
        </div>
    );
}