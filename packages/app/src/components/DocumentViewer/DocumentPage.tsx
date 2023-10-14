import {DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import Image from 'next/image'
import {Svg, Distance, Circle} from 'react-svg-path';
import BoundingBoxCanvas from "./BoundingBoxCanvas";


interface DocumentPageProps {
    page: Page,
    pageData: DocumentData,
}

export default function DocumentPage({ page, pageData }: DocumentPageProps) {
    // console.log("pages >", page)
    //Need to check actuall response type from the GDOCAI
    const buffer = page.image.content.data;
    const base64Data = Buffer.from(buffer).toString('base64');
    const imageDataURL = `data:${page.image.mimeType};base64,${base64Data}`;


    // const polygons = fields.map((f, i) => {

    //     const pointsString = f.pageAnchor[0].boundingPoly.map(p => `${p.x * 100},${p.y * 100}`).join(' ');
    //     return (
    //         <polygon 
    //             key={i} 
    //             points={pointsString} 
    //             className="fill-blue-500/50 stroke-blue-700/40 stroke-2 hover:cursor-pointer"
    //             vectorEffect={"non-scaling-stroke"}
    //             onClick={() => alert(`Content: ${f.value}, Confidence: ${f.confidence}`)}
    //             onMouseEnter={() => console.log()}
    //         />
    //     );
    // })

    return (
        <div className="w-full mb-6 shadow-xl relative">
            {/* <div className="w-full h-full absolute">
                <svg width={'100%'} height={'100%'} viewBox="0 0 100 100" preserveAspectRatio="none" >
                    {polygons}
                </svg>
            </div> */}
            <BoundingBoxCanvas 
                pageData={pageData}
            />
            <Image 
                src={imageDataURL} 
                width={0}
                height={0}
                alt="DocumentPage" 
                className="w-full h-auto" 
            />
        </div>
    );
}