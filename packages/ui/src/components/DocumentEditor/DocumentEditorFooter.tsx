import Link from "next/link";

import { DocumentMeta } from "@mortgage-document-ai/models";


import Button from "../UI/Button";
import ArrowUpRight from "@/assets/images/icons/arrow-up-right";


interface DocumentEditorFooterProps {
    isGeneratingJSON: boolean;
    isDataLoading: boolean;
    onViewJson?: () => void;
}

export default function DocumentEditorFooter({ isDataLoading, isGeneratingJSON, onViewJson }: DocumentEditorFooterProps) {
    return (
        <div className="p-4 border-t">
            <Button
                style="primary"
                icon={ArrowUpRight}
                disabled={isDataLoading}
                isLoading={isGeneratingJSON}
                onClick={onViewJson}
            >
                View JSON data
            </Button>
        </div>
    );
};