'use client';

import FileDrop from "@/components/FileDrop";
import { useState } from "react";
import axios from "axios";
import { NestedFormFieldsMap } from "@urla1003/types"
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import arrowUpRight from "@/assets/images/icons/arrow-up-right";
import questionMarkCircle from "@/assets/images/icons/question-mark-circle";
import githubLogo from "@/assets/images/icons/github-logo";


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
    processFileHandler(new File([data], 'sample_urla.pdf', { type: 'application/pdf' }));
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
    <main className="">
      <div>
        <a href="">
          <span>mortgage</span>
          <span>flow</span>
        </a>
        <a href="">
          {githubLogo}
          <span>
            Get source code
          </span>
        </a>
      </div>
      <div className="max-w-screen-sm mx-auto">
        <div className="mb-8">
          <h2 className="text-sm mb-4">OCR & AI FOR MORTGAGE DOCUMENTS</h2>
          <h1 className="text-3xl font-bold mb-4">Extract data from the URLA (Form 1003)</h1>
          <p className="text-blue-light mb-4">This tool was built to demonstrate the use of OCR & AI to extract structured data from mortgage documents. To learn how it works and get source code, please follow the link bellow.</p>
          <a href="">
            <span>Learn more</span>
            {arrowUpRight}
          </a>
        </div>
        <FileDrop />
        <div>
          <span>Don’t have filled 1003 handy?</span>
          <div onClick={sampleFileHandler}>Use sample file →</div>
        </div>
        <button>
          Extract data
        </button>
        <div>
          {questionMarkCircle}
          While this demo is designed for processing the 1003 form, the same technology can be used to extract data from any mortgage document. If you need guidance on implementing this, please don't hesitate to contact us.
        </div>
        <p>
          {isLoading && "Loading..."}
        </p>
      </div>
    </main>
  )
}
