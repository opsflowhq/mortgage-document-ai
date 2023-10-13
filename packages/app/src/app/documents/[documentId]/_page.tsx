// 'use client'

// import { Document, NestedFormFieldsMap, Page, ProcessedDocument } from "@urla1003/types";
// import { useCallback, useEffect, useState } from "react";
// import ReactFlow, { Controls, Background, BackgroundVariant, Handle, Position, PanOnScrollMode, useNodesState } from 'reactflow';
// import Image from 'next/image'


// import 'reactflow/dist/style.css';

// import PdfPage1 from '@/assets/images/pdf-preview/1.jpg';
// import PdfPage2 from '@/assets/images/pdf-preview/2.jpg';
// import PdfPage3 from '@/assets/images/pdf-preview/3.jpg';
// import PdfPage4 from '@/assets/images/pdf-preview/4.jpg';
// import PdfPage5 from '@/assets/images/pdf-preview/5.jpg';
// import PdfPage6 from '@/assets/images/pdf-preview/6.jpg';
// import PdfPage7 from '@/assets/images/pdf-preview/7.jpg';
// import PdfPage8 from '@/assets/images/pdf-preview/8.jpg';
// import PdfPage9 from '@/assets/images/pdf-preview/9.jpg';
// import axios from "axios";


// function DocumentPageNode({ data }: {data: {image: Page['image']}}) {
    
//     return (
//         <>
//             <div style={{ border: "5px solid red", width: data.image.width, height: data.image.height }}>
//                 {/* <div style={{ border: "5px solid red", }}> */}
//                 <Image src={data.image.content} alt="Document page Image" />
//             </div>

//         </>
//     );
// }

// const nodeTypes = { documentPage: DocumentPageNode };

// const pages = [
//     // { image: PdfPage1, width: 1275, height: 1650 },
//     // { image: PdfPage2, width: 1275, height: 1650 },
//     // { image: PdfPage3, width: 1275, height: 1650 },
//     // { image: PdfPage4, width: 1275, height: 1650 },
//     // { image: PdfPage5, width: 1275, height: 1650 },
//     // { image: PdfPage6, width: 1275, height: 1650 },
//     // { image: PdfPage7, width: 1275, height: 1650 },
//     // { image: PdfPage8, width: 1275, height: 1650 },
//     // { image: PdfPage9, width: 1275, height: 1650 },
// ];

// let maxY = 0;



// // [
// //     { id: 'node-1', type: 'documentPage', position: { x: 0, y: 0 }, data: { imageURL: PdfPage1 } },
// //     { id: 'node-2', type: 'documentPage', position: { x: 0, y: 1200 }, data: { imageURL: PdfPage2 } },
// //     // { id: 'node-3', type: 'documentPage', position: { x: 0, y: 3200 }, data: { imageURL: PdfPage3 } },
// //     // { id: 'node-4', type: 'documentPage', position: { x: 0, y: 4800 }, data: { imageURL: PdfPage4 } },
// //     // { id: 'node-5', type: 'documentPage', position: { x: 0, y: 6400 }, data: { imageURL: PdfPage5 } },
// //     // { id: 'node-6', type: 'documentPage', position: { x: 0, y: 8000 }, data: { imageURL: PdfPage6 } },
// //     // { id: 'node-7', type: 'documentPage', position: { x: 0, y: 9600 }, data: { imageURL: PdfPage7 } },
// //     // { id: 'node-8', type: 'documentPage', position: { x: 0, y: 11200 }, data: { imageURL: PdfPage8 } },
// //     // { id: 'node-9', type: 'documentPage', position: { x: 0, y: 12800 }, data: { imageURL: PdfPage9 } },
// // ];



// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

// const initialNodes = [];


// export default function DocumentPage({ params }: { params: { documentId: string } }) {
//     const documentId = params.documentId;
//     const [document, setDocument] = useState<null | ProcessedDocument>(null);


//     const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);


//     const addPagesHandler = (pages: Page[]) => {
//         const nodes = pages.map((page, i) => {
//             let x = 100;
//             let y = i * page.image.height + (i + 1) * 50;
//             maxY = y;
//             // if (i === 0) y += 50; 
        
//             return {
//                 id: `page-${i}`,
//                 type: 'documentPage',
//                 position: { x, y },
//                 data: { image: page.image },
//             };
//         });
        
//         setNodes(nodes);
//     }

//     const processDocument = async () => {
//         const documentJson = localStorage.getItem(documentId);
//         if (documentJson) {
//             const document = JSON.parse(documentJson) as Document;
//             const formData = new FormData();
//             formData.append('document', new File([document.base64], document.name));


//             const { data } = await axios.post<ProcessedDocument>('http://localhost:3001/document/process', formData);
//             setDocument(data);
//             console.log(data);
//         }
//     }

//     useEffect(() => {
//         console.log('Component did mount');
//         processDocument();
    
//     }, []);

    



//     // useEffect(() => {
//     //     if (document) {
//     //         PDFJS.getDocument(document.base64).promise.then(pdf => {
//     //             const pages = [];
//     //             this.pdf = pdf;
//     //             for (let i = 0; i < this.pdf.numPages; i++) {
//     //                 this.getPage(i + 1).then(result => {
//     //                     // the result is the base 64 version of image
//     //                 });
//     //             }
//     //         })
//     //     }
//     // }, [document]);

//     // const nodesIndex = initialNodes.length - 1;
//     // const maxY = nodesIndex * 800;

//     return (
//         <div style={{ display: 'grid', gridTemplateColumns: "450px auto", height: '100vh' }}>
//             <div style={{ background: "grey" }}>
//                 fs
//             </div>
//             <div >
//                 {/* <ReactFlow
//                     // fitView
//                     // fitViewOptions={{
//                     //     // padding: 50,
//                     //     nodes: [{id: "page-0"}]
//                     // }}
//                     defaultViewport={{
//                         x: 0,
//                         y: 0,
//                         zoom: 0.5
//                     }}
//                     nodesDraggable={false}
//                     nodeTypes={nodeTypes}
//                     nodes={initialNodes}
//                     // edges={initialEdges}
//                     panOnDrag={true}
//                     panOnScroll={true}
//                     panOnScrollMode={PanOnScrollMode.Vertical}
//                     // panActivationKeyCode={null}
//                     translateExtent={[
//                         [0, 0], //[x, y] top-left corner of the canvas
//                         [1475, maxY] //[x, y] bottom-right corner of the canvas
//                     ]}
//                 >
//                     <Controls />
//                     <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
//                 </ReactFlow> */}
//             </div>
//         </div>
//     );
// }