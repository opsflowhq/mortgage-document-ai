import Link from "next/link";

import { DocumentMeta } from "@mortgage-document-ai/models";

import SkeletonLoader from "../UI/SkeletonLoader";
import ArrowLeft from "@/assets/images/icons/arrow-left";


interface DocumentEditorHeaderProps {
    documentMeta?: DocumentMeta;
    isLoading?: boolean;
}

export default function DocumentEditorHeader({ isLoading, documentMeta }: DocumentEditorHeaderProps) {
    const [fileName, fileExtension] = documentMeta ? documentMeta?.sourceFileName.split('.') : [];

    return (
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
    );
};