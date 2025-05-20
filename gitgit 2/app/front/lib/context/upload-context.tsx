"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type UploadContextType = {
  file: File | null;
  filePreview: string | null;
  setFile: (file: File | null) => void;
  metadata: {
    title: string;
    caption: string;
    price: string;
    digitalResellPercentage: number;
    physicalMerchandisingPercentage: number;
    edition: number;
  };
  updateMetadata: (data: Partial<UploadContextType['metadata']>) => void;
};

const defaultMetadata = {
  title: "",
  caption: "",
  price: "",
  digitalResellPercentage: 500,
  physicalMerchandisingPercentage: 200,
  edition: 0,
};

const UploadContext = createContext<UploadContextType>({
  file: null,
  filePreview: null,
  setFile: () => {},
  metadata: defaultMetadata,
  updateMetadata: () => {},
});

export const useUpload = () => useContext(UploadContext);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFileState] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState(defaultMetadata);

  const setFile = (newFile: File | null) => {
    setFileState(newFile);
    
    // Clean up previous preview URL if it exists
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    
    // Create a new preview URL if a file is provided
    if (newFile) {
      const preview = URL.createObjectURL(newFile);
      setFilePreview(preview);
    } else {
      setFilePreview(null);
    }
  };

  const updateMetadata = (data: Partial<UploadContextType['metadata']>) => {
    setMetadata(prev => ({ ...prev, ...data }));
  };

  return (
    <UploadContext.Provider
      value={{
        file,
        filePreview,
        setFile,
        metadata,
        updateMetadata,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
