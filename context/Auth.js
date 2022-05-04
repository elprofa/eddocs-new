import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { set } from 'lodash';
const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState({
        localUser:null,
        localToken:null
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      
        const userinfo = localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):null;
        // console.log('userinfo: ', userinfo);
        if (!(userinfo === null || userinfo === undefined)) {
          
            setIsAuthenticated(true);
            setUser({
                localUser:userinfo.user,
                localToken:userinfo.jwt
            });
        }
        setIsLoading(false);
    }, []);


    // function authLogin(user){

    //       setIsAuthenticated(true);
    //       setUser(user);
    // }

    function authLogin(){
        const userinfo = localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):null;
        setIsAuthenticated(true);
        setUser({
            localUser:userinfo.user,
            localToken:userinfo.jwt
        });
  }

    function authLogout(){

            setIsAuthenticated(false);
            setUser({localUser:null,localToken:null});
            localStorage.removeItem("userinfo");
    }

  

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                authLogin,
                user,
                isLoading,
                authLogout
                
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };