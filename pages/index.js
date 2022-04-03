import React from "react";
import PageWrapper from "../components/PageWrapper";

import eddocsBackground from "../assets/image/eddocslogin1.jpg";
import imgL1LogoWhite from "../assets/image/logo1.png";
import { useEffect,useState } from "react";
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { GET_USER } from "../lib/graphql";
import Swal from 'sweetalert2';
import {useRouter} from 'next/router'
import { AuthContext } from "../context/Auth";


export default function MainPage (){


  const router = useRouter();
  const authContext = React.useContext(AuthContext);

  // React.useEffect(() => {
 
  //   const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    
  //   if(userinfo){
  //     router.push("/dashboard");
  //    }
  //   }, []);

  const [loginState,setLoginState] = useState({username:"",password:""});
  const [login, {data,loading,error}] = useMutation(GET_USER, { errorPolicy: 'all' });

  

 

  
    if(data){

      window.localStorage.setItem("userinfo", JSON.stringify(data.login));

      router.push('/dashboard');
    }
    if(error){

      const {message,extensions} = error.graphQLErrors[0];
        console.log(error);

    }

    

    
    
  
  
  
  const handleInput = e =>{

  
       const {name,value } = e.target;
       setLoginState({...loginState,[name]:value}); 
     
  }

  const handleForm = e =>{

       e.preventDefault();

       if(loginState.username=="" || loginState.password==""){

              Swal.fire({
                title: 'Erreur!',
                text: 'ces champs sont obligatoires',
                icon: 'error',
                confirmButtonText: 'ok',
                confirmButtonColor:'#517ACD'
              })
       }else{

            login({
              variables:{
                  identifier:loginState.username,
                  password:loginState.password
              }
            });
       }

      //  setLoginState({username:"",password:""});

       

      
  }

  




  return (
    <>
      <PageWrapper>
        {/* <div className="jobDetails-section bg-default pt-md-30 pt-sm-25 pt-23 pb-md-27 pb-sm-20 pb-17" style={{ background:`url(${eddocsBackground.src})`,backgroundRepeat:"no-repeat",backgroundSize:"100%"}}> */}
        <div className="jobDetails-section bg-default pt-md-30 pt-sm-25 pt-23 pb-md-27 pb-sm-20 pb-17">
          <div className="container">
                  <div className="row justify-content-center">
                            
                           <div style={{ boxShadow:"0px 0px 10px 0px grey",borderRadius:"15px",padding:"30px",background:"#fff"}}>
                                <img src={imgL1LogoWhite.src} alt="" className="mb-10"/>
                                <form className="form-container" onSubmit={handleForm} >
                                
                                <div className="form-group">
                                  {/* <label for="utilisateur">Nom d'utilisateur</label> */}
                                  <input type="text" className="form-control" id="utilisateur"  placeholder="Nom d'utilisateur" onChange={handleInput} value={loginState.username} name="username"/>
                                
                                </div>
                                <div className="form-group">
                                  {/* <label for="password">Mot de Passe</label> */}
                                  <input type="password" className="form-control" id="password" placeholder="Password" onChange={handleInput} value={loginState.password} name="password"/>
                                </div>
                                
                                <button type="submit" className="btn  btn-block" style={{ background:"#517ACD",color:"white" }} >Se Connecter</button>
                              </form>
                           </div>
                            

                         
                    </div>
          </div>
        </div>
            
      </PageWrapper>
    </>
  );
};
