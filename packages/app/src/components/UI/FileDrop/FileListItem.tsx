import DocumentIcon from "@/assets/images/icons/document-icon";
import { XMark } from "@/assets/images/icons/x-mark";
import prettyBytes from 'pretty-bytes';


interface FileListItemProps {
    fileName: string;
    fileSize: number;
    onRemove: () => void;
}

export default function FileListItem({ fileName, fileSize, onRemove }: FileListItemProps) {
    return (
        <div className='bg-background p-4 rounded text-sm flex gap-4'>
            <div className='w-10 border bg-white rounded flex'>
                <DocumentIcon className='w-6 h-6 m-auto stroke-primary-light' />
            </div>
            <div className='grow'>
                <div className='font-bold'>{fileName}</div>
                <div className='text-primary-light'>{prettyBytes(fileSize)}</div>
            </div>
            <div>
                <XMark
                    onClick={onRemove}
                    className='w-6 h-6 cursor-pointer hover:stroke-primary-light'
                />
            </div>
        </div>
    );
}