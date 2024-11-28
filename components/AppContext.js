import React, { createContext, useState } from 'react';

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  var [ tempDetailInvoice, setTempDetailInvoice ] = useState({});
  var [ tempDetailInvoiceList, setTempDetailInvoiceList ] = useState([]);

  return (
    <AppContext.Provider value={{ 
        tempDetailInvoice, setTempDetailInvoice,
        tempDetailInvoiceList, setTempDetailInvoiceList
     }}>
      {children}
    </AppContext.Provider>
  );
};
