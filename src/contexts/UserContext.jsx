import { createContext, useContext, useState, useEffect } from "react";

// Context oluşturma
export const UserContext = createContext();

// Custom hook ile context'e kolay erişim
export const useUser = () => useContext(UserContext);

// Provider bileşeni
export function UserProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const [isSuperUser, setIsSuperUser] = useState(localStorage.getItem('is_superuser') === 'true');
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));

  // Kullanıcı bilgilerini güncellemek için effect hook
  useEffect(() => {
    // Kullanıcı bilgilerini kontrol etmek için bir fonksiyon
    const checkUserInfo = () => {
      const currentUser = localStorage.getItem('user');
      const currentSuperuser = localStorage.getItem('is_superuser') === 'true';
      const currentUserId = localStorage.getItem('user_id');
      
      if (currentUser !== username) {
        setUsername(currentUser);
      }
      
      if (currentSuperuser !== isSuperUser) {
        setIsSuperUser(currentSuperuser);
      }

      if (currentUserId !== userId) {
        setUserId(currentUserId);
      }
    };
    
    // İlk yüklemede kontrol et
    checkUserInfo();

    // Storage event listener ekleyerek localStorage değişikliklerini dinle
    const handleStorageChange = () => {
      checkUserInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [username, isSuperUser, userId]);

  // Context değerlerini sağla
  const value = {
    username,
    isSuperUser,
    userId,
    setUsername,
    setIsSuperUser,
    setUserId
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
