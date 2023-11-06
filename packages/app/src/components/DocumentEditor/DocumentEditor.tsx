import EditorEntity from "./EditorEntity";
import { useDocumentContext } from "../DocumentProvider";
import Button from "../UI/Button";
import ArrowUpRight from "@/assets/images/icons/arrow-up-right";
import ArrowLeft from "@/assets/images/icons/arrow-left";
import Link from "next/link";
import SkeletonLoader from "../UI/SkeletonLoader";
import LoadingIndicator from "./LoadingIndicator";





export default function DocumentEditor() {

    const {
        documentModel,
        documentData,
        documentMeta,
        isLoading,
        isDocumentProcessing,
        isGeneratingJSON,
        onViewJSON } = useDocumentContext();

    const [fileName, fileExtension] = documentMeta ? documentMeta?.sourceFileName.split('.') : [];


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
                    style="primary"
                    icon={ArrowUpRight}
                    disabled={isLoading}
                    isLoading={isGeneratingJSON}
                    onClick={onViewJSON}
                >
                    View JSON data
                </Button>
            </div>
            {/* <EditorEntity /> */}


        </div>
    );
}