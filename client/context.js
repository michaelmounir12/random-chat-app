import React, { createContext, useState } from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [image, setimage] = useState("");
  const [ws,setws] = useState(null)
  const [room,setroom] = useState(null)

  return (
    <AuthContext.Provider value={{room,setroom, isLoading,setIsLoading,email,image,setimage,setemail,name,setname,ws,setws}}>
      {children}
    </AuthContext.Provider>
  );
};