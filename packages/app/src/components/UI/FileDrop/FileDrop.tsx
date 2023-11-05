'use client'

import { ChangeEvent, DragEvent, SyntheticEvent, useRef, useState } from 'react';
import CloudArrowUp from '@/assets/images/icons/cloud-arrow-up';
import { XMark } from '@/assets/images/icons/x-mark';
import DocumentIcon from '@/assets/images/icons/document-icon';
import FileListItem from './FileListItem';
import clsx from 'clsx';


interface FileDropProps {
    onFilesChange: (files: File[]) => void;
    files: File[];
    multiple?: boolean;
    accept?: string[]; //file extensions e.g. ['.pdf', '.mp3']
}

const FileDrop = ({ onFilesChange, files, multiple = true, accept }: FileDropProps) => {
    const [isOver, setIsOver] = useState(false);
    // const [files, setFiles] = useState<File[]>([]);

    console.log({ files });

    const inputRef = useRef<HTMLInputElement>(null);



    // Define the event handlers
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);
    };

    const handleClick = () => {
        inputRef?.current?.click();
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);

        const droppedFiles = Array.from(event.dataTransfer.files);
        if (!multiple) droppedFiles.splice(1)

        const filteredFiles = droppedFiles.filter(f => {
            if (accept === undefined) return true;
            const matchesExtension = accept?.some(ext => f.name.includes(ext));
            const matchesType = accept?.some(ext => f.type.includes(ext));

            return matchesExtension || matchesType;
        })

        onFilesChange(filteredFiles);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event?.target?.files) return;

        const files = event.target.files;
        if (!files) return;

        onFilesChange(Array.from(files));
    }

    const handleRemoveFile = (fileIndex: number) => {
        console.log(fileIndex);
        const newFilesList = [...files];
        newFilesList.splice(fileIndex, 1);
        onFilesChange(newFilesList);
    };

    return (
        <>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={clsx(
                    "bg-white hover:bg-background border border-dashed px-4 py-10 rounded-md flex flex-col items-center cursor-pointer",
                    isOver && "bg-background"
                )}
            >
                <div className='w-12 h-12 p-3 bg-background-dark rounded-full mb-4'>
                    <CloudArrowUp className='h-auto' />
                </div>
                <div className='text-sm'>Drop your Form 1003 here or click to upload</div>
                <div className='text-xs text-primary-light'>Accepted file type: PDF</div>
            </div>

            <input
                ref={inputRef}
                style={{ display: 'none' }}
                type="file"
                onChange={handleFileChange}
                multiple
                accept={accept?.join(', ')}
            />

            {/* Uploaded file list */}
            <div className='mt-4'>
                {files.map((f, i) => {
                    return (
                        <FileListItem
                            key={f.name}
                            fileName={f.name}
                            fileSize={f.size}
                            onRemove={() => handleRemoveFile(i)}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default FileDrop;