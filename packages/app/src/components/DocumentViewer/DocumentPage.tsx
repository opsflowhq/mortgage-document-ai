import { FormFieldValue, NestedFormFieldsMap, Page } from "@urla1003/types";
import Image from 'next/image'
import {Svg, Distance, Circle} from 'react-svg-path';


interface DocumentPageProps {
    page: Page,
    fields: FormFieldValue[],
}

export default function DocumentPage({ page, fields }: DocumentPageProps) {
    // console.log("pages >", page)
    //Need to check actuall response type from the GDOCAI
    const buffer = page.image.content.data;
    const base64Data = Buffer.from(buffer).toString('base64');
    const imageDataURL = `data:${page.image.mimeType};base64,${base64Data}`;

    console.log(fields);

    const polygons = fields.map((f, i) => {

        const pointsString = f.pageAnchor[0].boundingPoly.map(p => `${p.x * 100},${p.y * 100}`).join(' ');
        return (
            <polygon 
                key={i} 
                points={pointsString} 
                className="fill-blue-500/50 stroke-blue-700/40 stroke-2 hover:cursor-pointer"
                vectorEffect={"non-scaling-stroke"}
                onClick={() => alert(`Content: ${f.value}, Confidence: ${f.confidence}`)}
            />
        );
    })

    return (
        <div className="w-full mb-6 shadow-md relative">
            {/* <div className="relative h-auto"> */}
                {/* <img 
                    src={imageDataURL} 
                    alt="DocumentPage" 
                    className="w-auto" 
                    
                /> */}
            <div className="w-full h-full absolute">
                <svg width={'100%'} height={'100%'} viewBox="0 0 100 100" preserveAspectRatio="none" >
                    {polygons}
                    {/* <polygon points="0,0 0,100 30,20 30,0" /> */}
                    {/* <rect x={50} y={50} fill="green" width={50} height={50} /> */}

                    {/* <Rect x={200} y={100} fill="blue" width={150} height={300} />
                    <Rect x={100} y={160} fill="red" width={200} height={120} />
                    <Sqr x={150} y={150} fill="pink" side={80} /> */}
                </svg>
            </div>
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