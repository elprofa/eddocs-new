import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { withTheme } from "styled-components";

const AuthContext = React.createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = React.useState({});

  useEffect(()=>{

     const userinfo = JSON.parse(localStorage.getItem("userinfo"));


     if(userinfo){

        if(router.pathname=="/"){
          router.push("/dashboard");
        }
        setAuthState(userinfo);
     }else{
        router.push("/");
     }
     
  },[authState]);

  

  
 return (
   <Provider value={authState}>
    {children}
   </Provider>
 );
};

export { AuthContext, AuthProvider };