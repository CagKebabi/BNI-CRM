import { createContext, useContext, useState } from "react";

// Context oluşturma
export const GroupContext = createContext();

// Custom hook ile context'e kolay erişim
export const useGroup = () => useContext(GroupContext);

// Provider bileşeni
export function GroupProvider({ children }) {
  const [selectedGroupContext, setSelectedGroupContext] = useState(null);

  // Context değerlerini sağla
  const value = {
    selectedGroupContext,
    setSelectedGroupContext
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}
