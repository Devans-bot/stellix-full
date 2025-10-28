import React, { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFilePrev, setUploadFilePrev] = useState(null);

  return (
    <UploadContext.Provider value={{ uploadFile, setUploadFile, uploadFilePrev, setUploadFilePrev }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
