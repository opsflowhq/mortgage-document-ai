'use client'

import { ChangeEvent, DragEvent, SyntheticEvent, useRef, useState } from 'react';
import cloudArrowUp from '@/assets/images/icons/cloud-arrow-up';

const FileDrop = () => {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);

    // Use FileReader to read file content
    droppedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(reader.result);
      };

      reader.onerror = () => {
        console.error('There was an issue reading the file.');
      };

      reader.readAsDataURL(file);
      return reader;
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files) return;

    const file = event.target.files;
    if (!file) return;


  }

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
          width: '300px',
          border: '1px dotted',
          backgroundColor: isOver ? 'lightgray' : 'white',
        }}
      >
        {cloudArrowUp}
        <div>Drop your Form 1003 here or click to browse</div>
        <div>Accepted file types: PDF, JPEG, PNG</div>
      </div>

      <input
        ref={inputRef}
        style={{display: 'none'}}
        type="file"
        onChange={handleFileChange}
      />
    </>
  );
}

export default FileDrop;