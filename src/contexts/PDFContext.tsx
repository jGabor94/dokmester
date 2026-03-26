'use client'

import { createContext, useContext, useState } from "react";

const PDFContext = createContext({});

export const usePDF = () => useContext(PDFContext);

export const PDFProvider = ({children} : {children : React.ReactNode}) => {
  const [pdfType, setPdfType] = useState('');
  const [color, setColor] = useState('#13a4ec');
  const [image, setImage] = useState('/Banner_Web.png');
  const [data, setData] = useState();

  return (
    <PDFContext.Provider value={{pdfType, setPdfType, data, setData, color, setColor, image, setImage}}>
      {children}
    </PDFContext.Provider>
  )
}