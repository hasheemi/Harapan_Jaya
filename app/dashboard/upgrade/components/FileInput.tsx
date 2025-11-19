"use client";

import { useRef, useState } from "react";

interface FileInputProps {
  label: string;
  onChange?: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
}

export default function FileInput({ label, onChange, accept, placeholder = "Choose file..." }: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file ? file.name : "");
    onChange?.(file);
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept={accept}
          className="hidden"
        />
        {/* <button
          type="button"
          onClick={handleClick}
          className="btn btn-secondary flex-1 text-left justify-start"
        >
          {fileName || placeholder}
        </button> */}
      </div>
    </fieldset>
  );
}
