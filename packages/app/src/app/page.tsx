'use client';

import FileDrop from "@/components/UI/FileDrop/FileDrop";
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import ArrowUpRight from "@/assets/images/icons/arrow-up-right";
import questionMarkCircle from "@/assets/images/icons/question-mark-circle";
import githubLogo from "@/assets/images/icons/github-logo";
import Button from "@/components/UI/Button";
import ArrowSmallRight from "@/assets/images/icons/arrow-small-right";
import ExclamationCircle from "@/assets/images/icons/exclamation-circle";
import Link from "next/link";
import config from "@/utils/config";
import { setLocalFile } from "@/utils";
import Alert from "@/components/UI/Alert";


const sampleFileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/urla-samples/urla_borrower_information.pdf`;

const toBase64 = (file: File) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export default function Home() {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const processFile = async (file: File) => {
        const fileStorageKey = uuidv4();
        await setLocalFile(fileStorageKey, { source: file, processedDocument: null });
        router.push(`/documents/${fileStorageKey}`);
    }

    const sampleFileHandler = async () => {
        setLoading(true);
        const { data } = await axios.get<Blob>(sampleFileUrl, { responseType: 'blob' });
        await processFile(new File([data], 'sample_form_1003.pdf', { type: 'application/pdf' }));
    };


    const extractDataHandler = async () => {
        setLoading(true);
        await processFile(files[0])
    }


    return (
        <>
            <header className="p-4 border-b sticky top-0 bg-white flex justify-between">
                <a href="https://www.mortgageflow.io" target="_blank" className="text-xl">
                    <span className="font-bold">mortgage</span>
                    <span>flow</span>
                </a>
                <a href="" className="font-medium flex gap-2 items-center text-sm">
                    {githubLogo}
                    <span>
                        Get source code
                    </span>
                </a>
            </header>
            <main className="max-w-screen-sm mx-auto my-20 px-4">
                {/* <div className=""> */}
                <div className="mb-12">
                    <h2 className="text-sm mb-4">OCR & AI FOR MORTGAGE DOCUMENTS</h2>
                    <h1 className="text-3xl font-bold mb-4">Extract data from the URLA (Form 1003)</h1>
                    <p className="text-sm text-primary-light mb-4">This tool was built to demonstrate the use of OCR & AI to extract structured data from mortgage documents. To learn how it works and get source code, please follow the link bellow.</p>
                    <Button style="underline" href="/" icon={ArrowUpRight}>Learn more</Button>
                </div>

                <div className="pb-12  border-background-dark border-b">
                    <div className="mb-4">
                        <FileDrop
                            files={files}
                            onFilesChange={files => setFiles(files)}
                            multiple={false}
                            accept={['.pdf']}
                        />
                    </div>

                    {
                        !files.length && (
                            <div className="flex justify-between items-center p-4 mb-4 bg-background rounded-md">
                                <span className="text-sm">Don&apos;t have filled 1003 handy?</span>
                                <Button style="underline" icon={ArrowSmallRight} onClick={sampleFileHandler} disabled={isLoading}>Use sample file</Button>
                            </div>)
                    }

                    <Button
                        onClick={extractDataHandler}
                        disabled={!files.length}
                        isLoading={isLoading}
                        style="primary"
                    >
                        Extract data
                    </Button>
                </div>





                <Alert
                    style="info"
                >
                    <p>
                        While this demo is designed for processing the Form 1003, the same technology can be used to extract data from any mortgage document. If you need guidance on implementing this, please don&apos;t hesitate to <Link href={'https://www.mortgageflow.io/book-a-demo'} target="_blank" className="font-semibold">contact us</Link>.
                    </p>
                </Alert>
                {/* </div> */}
            </main>
        </>
    )
}
