'use client';

import FileDrop from "@/components/FileDrop";
import { useState } from "react";
import axios from "axios";
import {NestedFormFieldsMap} from "@urla1003/types"
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";


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

    if(base64String) localStorage.setItem(documentId, JSON.stringify(documentPayload));
    router.push(`/documents/${documentId}`);

    // const formData = new FormData();
    // formData.append('document', file);


    // const { data } = await axios.post<NestedFormFieldsMap>('http://localhost:3001/document/process', formData);
    setLoading(false);
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello world!</h1>
      <FileDrop />
      <button onClick={sampleFileHandler}>Use sample file</button>
      <p>
        {isLoading && "Loading..."}
      </p>
    </main>
  )
}
