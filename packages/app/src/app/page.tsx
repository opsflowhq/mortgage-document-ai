'use client';

import FileDrop from "@/components/FileDrop";
import { useState } from "react";
import axios from "axios";
import { NestedFormFieldsMap } from "@urla1003/types"
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import ArrowUpRight from "@/assets/images/icons/arrow-up-right";
import questionMarkCircle from "@/assets/images/icons/question-mark-circle";
import githubLogo from "@/assets/images/icons/github-logo";
import Button from "@/components/UI/Button";
import ArrowSmallRight from "@/assets/images/icons/arrow-small-right";
import ExclamationCircle from "@/assets/images/icons/exclamation-circle";


const sampleFileUrl = "http://localhost:3001/urla-samples/urla_borrower_information.pdf";

const toBase64 = (file: File) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

export default function Home() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const sampleFileHandler = async () => {
    const { data } = await axios.get<Blob>(sampleFileUrl, { responseType: 'blob' });
    processFileHandler(new File([data], 'sample_form_1003.pdf', { type: 'application/pdf' }));
  };

  const processFileHandler = async (file: File) => {
    setLoading(true);
    const base64String = await toBase64(file);
    // const documentId = uuidv4();
    const documentId = "b8c646e9-90ed-4dd9-9af3-d99c2338c7ce";

    //Rewrite to the IndexDB
    const documentPayload = {
      name: file.name,
      base64: base64String?.toString()
    };

    if (base64String) localStorage.setItem(documentId, JSON.stringify(documentPayload));
    router.push(`/documents/${documentId}`);

    // const formData = new FormData();
    // formData.append('document', file);


    // const { data } = await axios.post<NestedFormFieldsMap>('http://localhost:3001/document/process', formData);
    setLoading(false);
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
      <main className="max-w-screen-sm mx-auto my-20">
        {/* <div className=""> */}
          <div className="mb-12">
            <h2 className="text-sm mb-4">OCR & AI FOR MORTGAGE DOCUMENTS</h2>
            <h1 className="text-3xl font-bold mb-4">Extract data from the URLA (Form 1003)</h1>
            <p className="text-sm text-primary-light mb-4">This tool was built to demonstrate the use of OCR & AI to extract structured data from mortgage documents. To learn how it works and get source code, please follow the link bellow.</p>
            {/* <a href="">
            <div className="gap-2 items-center border-b inline-flex text-secondary hover:text-secondary-light">
              <span>Learn more</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </a> */}
            <Button style="underline" href="/" icon={ArrowUpRight}>Learn more</Button>
          </div>

          <div className="pb-12  border-background-dark border-b">
            <FileDrop />
            <div className="flex justify-between items-center p-4 my-4 bg-background rounded-md">
              <span className="text-sm">Don&apos;t have filled 1003 handy?</span>
              <Button style="underline" icon={ArrowSmallRight} onClick={sampleFileHandler}>Use sample file</Button>
              {/* <div onClick={sampleFileHandler}>Use sample file →</div> */}
            </div>

            <Button style="primary">Extract data</Button>
          </div>




          <div className="text-sm text-primary-light p-4 bg-background rounded flex gap-4 mt-12">
            <div className="w-6">
              <ExclamationCircle className="w-6 h-6"/>
            </div>
            <span>
              While this demo is designed for processing the 1003 form, the same technology can be used to extract data from any mortgage document. If you need guidance on implementing this, please don't hesitate to contact us.
            </span>
          </div>
          <p>
            {isLoading && "Loading..."}
          </p>
        {/* </div> */}
      </main>
    </>
  )
}
