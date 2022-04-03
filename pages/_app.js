// import App from 'next/app'
import Layout from "../components/Layout";
import { GlobalProvider } from "../context/GlobalContext";

import { ApolloProvider } from "@apollo/client";

// import "../assets/fonts/fontawesome-5/webfonts/fa-brands-400.ttf";
// import "../assets/fonts/fontawesome-5/webfonts/fa-regular-400.ttf";
import "../assets/fonts/fontawesome-5/css/all.min.css";

// import "../assets/fonts/icon-font/css/style.css";
import "../node_modules/slick";
import "../node_modules/slick-carousel/slick/slick.css";
import "../node_modules/slick-carousel/slick/slick-theme.css";
import "../node_modules/aos/dist/aos.css";

import "../assets/fonts/icon-font/css/style.css";
import "../assets/fonts/fontawesome-5/css/all.css";

import "../scss/bootstrap.scss";
import "../scss/main.scss";
import withData from "../lib/withData";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/Auth";



const MyApp = ({ Component, pageProps, router,apollo }) => {

  
 

  

  // console.log(apollo)

  

 

  if (router?.pathname.match(/404/)) {
    return (
      <ApolloProvider client={apollo}>
        <AuthProvider>
        <GlobalProvider>
          <Layout pageContext={{ layout: "bare" }}>
            <Component {...pageProps} />
          </Layout>
        </GlobalProvider>
        </AuthProvider>
      </ApolloProvider>
    );
  }
  if (router?.pathname.match(/dashboard/)) {
    return (
      <ApolloProvider client={apollo}>
        <AuthProvider>
        <GlobalProvider>
          <Layout pageContext={{ layout: "dashboard" }}>
            <Component {...pageProps} />
          </Layout>
        </GlobalProvider>
        </AuthProvider>
      </ApolloProvider>
    );
  }

  return (
    
    <ApolloProvider client={apollo}>
      {/* <GlobalProvider>
        <Layout pageContext={{}}>
          <Component {...pageProps} />
        </Layout>
      </GlobalProvider> */}
       <AuthProvider>
        <GlobalProvider>
         
          <Layout pageContext={{ layout: "dashboard" }}>
            
            <Component {...pageProps} />
           
          </Layout>
         
        </GlobalProvider>
      </AuthProvider>
      
    </ApolloProvider>
    
  );





};



MyApp.getInitialProps=async function ({Component,ctx}){
 
  let pageProps={};
  if(Component.getInitialProps){
    pageProps=await Component.getInitialProps(ctx);
  }

  pageProps.query=ctx.query;

  return {pageProps};

}
export default withData(MyApp);
