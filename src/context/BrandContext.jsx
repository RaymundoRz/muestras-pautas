import { createContext, useState, useContext } from 'react';

const BrandContext = createContext();

export function BrandProvider({ children }) {
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <BrandContext.Provider value={{ selectedBrand, setSelectedBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
