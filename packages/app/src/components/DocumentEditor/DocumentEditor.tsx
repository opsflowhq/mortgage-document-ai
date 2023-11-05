import { DocumentData, Form1003, Page } from "@urla1003/types";
import DocumentField from "./EditorField";
import EditorEntity from "./EditorEntity";
import { FieldHoverEvent } from "../DocumentViewer/BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";
import Button from "../UI/Button";
import ArrowUpRight from "@/assets/images/icons/arrow-up-right";
import ArrowLeft from "@/assets/images/icons/arrow-left";
import Link from "next/link";
import SkeletonLoader from "../UI/SkeletonLoader";
import Lottie from "lottie-react";
import circleLoaderAnimation from '@/assets/animations/circle-loader3.json';
import CircleLoader from "../UI/CircleLoader/CircleLoader";
import LoadingIndicator from "./LoadingIndicator";
import { documentDataToJson } from "@/utils";



interface DocumentEditorProps {
    // isLoading: boolean;
    // documentModel: Form1003.DocumentModel; 
    // documentData?: DocumentData;
    // hoveredField: FieldHoverEvent | null;
}

export default function DocumentEditor({ }: DocumentEditorProps) {

    // console.log('Data schema ->', documentModel);
    // console.log('Data ->', documentData);

    const { documentModel, documentData, documentMeta, isLoading, isDocumentProcessing } = useDocumentContext();

    const [fileName, fileExtension] = documentMeta ? documentMeta?.sourceFileName.split('.') : [];

    console.log("JSON ->", JSON.stringify(documentData))

    return (
        <div className="h-screen shadow-2xl flex flex-col relative text-sm z-10">
            <div className="border-b p-4 flex gap-4 items-center">
                <Link href={"/"}>
                    <ArrowLeft className="w-5 h-5 stroke-2 cursor-pointer hover:stroke-secondary" />
                </Link>
                <div>
                    <div className="text-lg font-semibold whitespace-nowrap inline-flex w-auto items-center overflow-auto">
                        <span className="">
                            Form 1003 (
                        </span>
                        <SkeletonLoader
                            isLoading={isLoading}
                            height={18}
                            width={'100%'}
                        >
                            <span className="text-ellipsis overflow-hidden grow">{fileName}</span>
                            <span>
                                .{fileExtension}
                            </span>
                        </SkeletonLoader>
                        <span>)</span>
                    </div>

                </div>
            </div>
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
                            // hoveredField={hoveredField}
                            />
                        );
                    })
                }
            </div>
            <div className="p-4 border-t">
                <Button
                    href={`https://jsonhero.io/new?j=${documentDataToJson(documentData)}`}
                    target="_blank"
                    style="primary"
                    icon={ArrowUpRight}
                    disabled={isLoading}
                >
                    View JSON data
                </Button>
            </div>
            {/* <EditorEntity /> */}


        </div>
    );
}