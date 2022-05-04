import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import * as XLSX from "xlsx";

import { useQuery,useMutation,useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from "next/router";

import { CREATE_AFFECTATION, CREATE_RUBRIQUE, CREATE_SALARIE, GET_ALL_AFFECTATIONS, GET_ALL_RUBRIQUES, GET_ALL_SALARIES, GET_SOCIETE, LISTE_DOCUMENTS } from "../lib/graphql";
// import { AuthContext } from "../context/Auth";
import { useAuth } from "../context/Auth";
import FullPageLoader from "../components/FullPageLoader";

import { Tab,Tabs } from "react-bootstrap";
import { set } from "lodash";
import Swal from 'sweetalert2';

const defaultJobs = [
  { value: "pd", label: "Product Designer" },
  { value: "gd", label: "Graphics Designer" },
  { value: "fd", label: "Frontend Developer" },
  { value: "bd", label: "Backend Developer" },
  { value: "cw", label: "Content Writer" },
];

export default function Dashboard () {

  const router = useRouter();
  
   const {isAuthenticated, user, isLoading } = useAuth();
  // const {data,error,loading}=useQuery(LISTE_DOCUMENTS);
  const [fileNameError,setFileNameError] = useState("");
  const  [getSociete,societeData]  = useLazyQuery(GET_SOCIETE);
  const  [getAllSalaries,allSalriesData]  = useLazyQuery(GET_ALL_SALARIES);
  const  [getAllRubriques,allRubriquesData]  = useLazyQuery(GET_ALL_RUBRIQUES);
  const  [getAllAffectations,allAffectationsData]  = useLazyQuery(GET_ALL_AFFECTATIONS);
  const [societeId,setSocieteId] = useState(null);
  //  const  societeData = useQuery(GET_SOCIETE,{
  //       variables: { username:user.localUser.username,id:user.localUser.id}
  //      });
  
   const [createSalarieFunction,createSalarieResponse] = useMutation(CREATE_SALARIE, { errorPolicy: 'all' });
   const [createRubriqueFunction,createRubriqueResponse] = useMutation(CREATE_RUBRIQUE, { errorPolicy: 'all' });
   const [createAffectationFunction,createAffectationResponse] = useMutation(CREATE_AFFECTATION, { errorPolicy: 'all' });
   

React.useEffect(()=>{

  if((isAuthenticated && !isLoading) && societeData.data){
    
    getAllSalaries({
      variables:{
            id:societeData.data.societes.data[0].id
      }
      
  });

  getAllRubriques({
    variables:{
          id:societeData.data.societes.data[0].id
    }
    
});

getAllAffectations({
  variables:{
        id:societeData.data.societes.data[0].id
  }
  
});
 

  }


   
 
},[societeData.data]);


if(allRubriquesData.data){

     console.log(allRubriquesData);
}
// if(societeData.data){

//     console.log(societeData.data.societes.data[0].id);
// }


React.useEffect(() => {

  if((isAuthenticated && !isLoading) && user.localUser!=null){

    getSociete({
        variables: { username:user.localUser.username,id:user.localUser.id}
      });  
        
}


    
    if(!isLoading && !isAuthenticated){

         router.push('/');
    }

    



  }, [isAuthenticated,isLoading]);


  // if(isLoading || !isAuthenticated){
  if(isLoading || !isAuthenticated){

          return <FullPageLoader/>;
  }

  

const acceptableFileName = ['xlsx',"xls"];

const checkFileName = (name) =>{
        return acceptableFileName.includes(name.split(".").pop().toLowerCase());
}
 const  handleFile = async e =>{

       const file = e.target.files[0];

       if(!file) return;

       if(file.name=="FicheExcel.xlsx"){
           setFileNameError("");

          if(!checkFileName(file.name)){

               setFileNameError("Ce type de fichier ne peut être uploadé");
          }else{
                setFileNameError("");

                const data = await file.arrayBuffer();

                const wb = XLSX.read(data,{type:'binary', cellDates:true, cellNF: false, cellText:false});

                if(e.target.id=="salaries"){

                      const salariesIndice = wb.SheetNames[0];

                      const salariesSheet = wb.Sheets[salariesIndice];

                      const data = XLSX.utils.sheet_to_json(salariesSheet,{raw: false,dateNF:"DD/MM/YYYY"});
                      

                      // getSociete({
                      //     variables: { username:user.localUser.username,id:user.localUser.id}
                      //   });

                      if(societeData.data){

                        // console.log(societeData.data.societes.data[0].id); 
                        const societe = societeData.data.societes.data[0].id;

                        
                            let NumSalarie = '';
                            let Matricule = '';
                            let Civilite = '';
                            let Nom = '';
                            let Prenom = '';
                            let NomJeuneFille= '';
                            let Rue = '';
                            let Commune = '';
                            let CodePostale = '';
                            let SituationFamiliale = '';
                            let DateDebutService = '';
                            let DateFinService = '';
                            let Statut  = '';
                            
                       

                        data.forEach(element => {
                             NumSalarie = element.NumSalarie;
                             Matricule = element.Matricule;
                             Civilite = element.Civilité;
                             Nom = element.Nom;
                             Prenom = element.Prenom;
                             NomJeuneFille= element.NomJeuneFille;
                             Rue = element.Rue;
                             Commune = element.Commune;
                             CodePostale = element.CodePostale;
                             SituationFamiliale = element.SituationFamiliale;
                             DateDebutService = String(element.DateDebutService);
                             DateFinService = String(element.DateFinService);
                             Statut  = element.Statut;
                            createSalarieFunction({
                              variables:{data:{NumSalarie,Matricule,Civilite,Nom,Prenom,NomJeuneFille,Rue,Commune,CodePostale,SituationFamiliale,DateDebutService,DateFinService,Statut,societe}}
                            });
                          
                        });

                        document.getElementById("salaries").value=null; 

                        Swal.fire({
                          title: 'Succès!',
                          text: 'les salariés sont uploadés avec succès',
                          icon: 'success',
                          confirmButtonText: 'ok',
                          confirmButtonColor:'#517ACD'
                        })

                        getAllSalaries({
                          variables:{
                                id:societeData.data.societes.data[0].id
                          }
                      });
                        

                    }else{

                      setFileNameError("Une erreur s'est produite");
                    }

                }

                if(e.target.id=="rubriques"){

                  const salariesIndice = wb.SheetNames[1];
                  const salariesSheet = wb.Sheets[salariesIndice];

                  
                  const data = XLSX.utils.sheet_to_json(salariesSheet,{raw: false,dateNF:"DD/MM/YYYY"});

                  console.log(data);
                  

                  // getSociete({
                  //     variables: { username:user.localUser.username,id:user.localUser.id}
                  //   });

                  if(societeData.data){

                    // console.log(societeData.data.societes.data[0].id); 
                    const societe = societeData.data.societes.data[0].id;

                    
                        let IdRub = '';
                        let CodeRubrique = '';
                        let TypeRubrique = '';
                        let TauxSalariale = '';
                        let TauxPatronale= '';
                        let MontantPatronale = '';
                        let MontantSalariale = '';
                        let Plafond = '';
                        let CodePostale = '';
                        let Intitule = '';
                        let Memo = '';
                       

                    data.forEach(element => {
                         IdRub = element.IdRub;
                         CodeRubrique = element.CodeRubrique;
                         TypeRubrique = element.TypeRubrique;
                         TauxSalariale = parseInt(element.TauxSalariale);
                         TauxPatronale = parseInt(element.TauxPatronale);
                         MontantPatronale =parseInt(element.MontantPatronale);
                         MontantSalariale =parseInt(element.MontantSalariale);
                         Plafond=parseInt(element.Plafond);
                         CodePostale = element.CodePostale;
                         Intitule = element.Intitule;
                         Memo = element.Memo;
                        createRubriqueFunction({
                          variables:{data:{IdRub,CodeRubrique,TypeRubrique,TauxSalariale,TauxPatronale,MontantPatronale,MontantSalariale,Plafond,CodePostale,Intitule,Memo,societe}}
                        });
                      
                    });

                    document.getElementById("rubriques").value=null; 

                    Swal.fire({
                      title: 'Succès!',
                      text: 'les rubriques sont uploadés avec succès',
                      icon: 'success',
                      confirmButtonText: 'ok',
                      confirmButtonColor:'#517ACD'
                    })

                    getAllRubriques({
                      variables:{
                            id:societeData.data.societes.data[0].id
                      }
                  });
                    

                }else{

                  setFileNameError("Une erreur s'est produite");
                }
                }

                if(e.target.id=="affectations"){

                  const salariesIndice = wb.SheetNames[2];
                  const salariesSheet = wb.Sheets[salariesIndice];

                  
                  const data = XLSX.utils.sheet_to_json(salariesSheet,{raw: false,dateNF:"DD/MM/YYYY"});

                  console.log(data);
                  

                  // getSociete({
                  //     variables: { username:user.localUser.username,id:user.localUser.id}
                  //   });

                  if(societeData.data){

                    // console.log(societeData.data.societes.data[0].id); 
                    const societe = societeData.data.societes.data[0].id;

                    
                        let IdAddect = '';
                        let NumSalarie = '';
                        let CodeRubrique = '';
                        let DateHist = '';
                        let ValeurNombre= '';
                        let ValeurBase = '';
                        let ValeurMontant = '';
                       
                    data.forEach(element => {
                         IdAddect = element.IdAddect;
                         NumSalarie = parseInt(element.NumSalarie);
                         CodeRubrique = element.CodeRubrique;
                         DateHist = String(element.DateHist);
                         ValeurNombre = parseInt(element.ValeurNombre);
                         ValeurBase =parseInt(element.ValeurBase);
                         ValeurMontant =parseInt(element.ValeurMontant);
                        createAffectationFunction({
                          variables:{data:{IdAddect,NumSalarie,CodeRubrique,DateHist,ValeurBase,ValeurMontant,ValeurNombre,societe}}
                        });
                      
                    });

                    document.getElementById("affectations").value=null; 

                    Swal.fire({
                      title: 'Succès!',
                      text: 'les affectations sont uploadées avec succès',
                      icon: 'success',
                      confirmButtonText: 'ok',
                      confirmButtonColor:'#517ACD'
                    })

                    getAllAffectations({
                      variables:{
                            id:societeData.data.societes.data[0].id
                      }
                  });
                    

                }else{

                  setFileNameError("Une erreur s'est produite");
                }
                }
               
          }


             
       }else{

           setFileNameError("ce n'est pas le fichier qu'il faut");
       }

       
    
 }


  const onChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      console.log(data);
    };
    reader.readAsBinaryString(file);
  };




  return (
    <>
      <PageWrapper
        headerConfig={{
          button: "profile",
          isFluid: true,
          bgClass: "bg-default",
          reveal: false,
        }}
      >
        <div className="dashboard-main-container mt-25 mt-lg-31">
          <div className="container">
            <div className="mb-18">
              
              <div style={{ height:"100vh",overflowX:"auto"}} className="bg-white shadow-8 pt-7 rounded pb-9 px-11 ">

              <Tabs defaultActiveKey="salaries" id="uncontrolled-tab-example" className="mb-3">
                      <Tab eventKey="salaries" title="Salariés">
                      <div className="containter-fluid">
                                 <div className="row my-9">
                                          {/* <button className="btn btn-primary rounded">Uploader Salariés</button> */}
                                          <div className="col-sm-4">
                                          {
                                           
                                          allSalriesData.data?allSalriesData.data.salaries.data.length>0?"":<input type="file" id="salaries" accept="xlsx,xls" multiple={false} onChange={(e)=> handleFile(e)}/>:""
                                          }
                                          
                                          {
                                              fileNameError!=""?<p className="text-danger">{fileNameError}</p>:""
                                          }
                                          </div>
                                          <div className="col-sm-4">
                                              {
                                                allSalriesData.data?allSalriesData.data.salaries.data.length>0?<button className="btn btn-primary rounded">Ajouter un salarie</button>:"":""
                                                 
                                              }
                                               
                                          </div>
                                          <div className="col-sm-4">
                                            {
                                              allSalriesData.data?allSalriesData.data.salaries.data.length>0?<button className="btn btn-danger rounded">Tout Supprimer</button>:"":""
                                                
                                            }
                                                
                                          </div>
                                          
                                 </div>
                                 <div className="row my-2">

                                          
                                    {
                                       allSalriesData.data?allSalriesData.data.salaries.data.length>0? (


                                        //  console.log(allSalriesData.data.salaries.data)
                                        <table className="table table-striped table-bordered">
                                        <thead>
                                          <tr>
                                            <th scope="col">NumSalarie</th>
                                            <th scope="col">Matricule</th>
                                            <th scope="col">Civilite</th>
                                            <th scope="col">Nom</th>
                                            <th scope="col">Prenom</th>
                                            <th scope="col">NomJeuneFille</th>
                                            <th scope="col">Commune</th>
                                            <th scope="col">CodePostale</th>
                                            <th scope="col">SituationFamiliale</th>
                                            <th scope="col">DateDebutService</th>
                                            <th scope="col">DateFinService</th>
                                            <th scope="col">Statut</th>
                                            <th></th>
                                           
                                          </tr>
                                        </thead>
                                        <tbody>

                                            {

                                                allSalriesData.data.salaries.data.map((salarie,index) =>(

                                                  <tr key={index}>
                                                  <td>{salarie.attributes.NumSalarie}</td>
                                                  <td>{salarie.attributes.Matricule}</td>
                                                  <td>{salarie.attributes.Civilite}</td>
                                                  <td>{salarie.attributes.Nom}</td>
                                                  <td>{salarie.attributes.Prenom}</td>
                                                  <td>{salarie.attributes.NomJeuneFille}</td>
                                                  <td>{salarie.attributes.Commune}</td>
                                                  <td>{salarie.attributes.CodePostale}</td>
                                                  <td>{salarie.attributes.SituationFamiliale}</td>
                                                  <td>{salarie.attributes.DateDebutService}</td>
                                                  <td>{salarie.attributes.DateFinService}</td>
                                                  <td>{salarie.attributes.Statut}</td>
                                                  
                                                  <td><button className="btn btn-danger rounded">delete</button></td>
                                                  <td><button className="btn btn-primary rounded">update</button></td>
                                                </tr>
                                                                                                          
                                                  ))
                                            }
                                         
                                          
                                         
                                        </tbody>
                                 </table>

                                       
                                   
                                         
                                         ):<h1>Uploader vos salariés</h1>:""
                                    }     
                                 

                                 

                                 </div>
                      </div>
                        
                      </Tab>
                      <Tab eventKey="rubriques" title="Rubriques">
                      <div className="containter-fluid">
                      <div className="row my-9">
                                          {/* <button className="btn btn-primary rounded">Uploader Salariés</button> */}
                                          <div className="col-sm-4">
                                          {


                                           
                                   allRubriquesData.data?allRubriquesData.data.rubriques.data.length>0?"":<input type="file" id="rubriques" accept="xlsx,xls" multiple={false} onChange={(e)=> handleFile(e)}/>:""
                                          }
                                          
                                          {
                                              fileNameError!=""?<p className="text-danger">{fileNameError}</p>:""
                                          }
                                          </div>
                                          <div className="col-sm-4">
                                              {
                                                allRubriquesData.data?allRubriquesData.data.rubriques.data.length>0?<button className="btn btn-primary rounded">Ajouter une Rébrique</button>:"":""
                                                 
                                              }
                                               
                                          </div>
                                          <div className="col-sm-4">
                                            {
                                              allRubriquesData.data?allRubriquesData.data.rubriques.data.length>0?<button className="btn btn-danger rounded">Supprimer toutes les rébriques</button>:"":""
                                                
                                            }
                                                
                                          </div>
                                          
                                 </div>
                                 <div className="row my-2">

                                          
                                    {
                                       allRubriquesData.data?allRubriquesData.data.rubriques.data.length>0? (


                                        //  console.log(allSalriesData.data.salaries.data)
                                        <table className="table table-striped table-bordered">
                                        <thead>
                                          <tr>
                                          								

                                            <th scope="col">IdRub</th>
                                            <th scope="col">CodeRubrique</th>
                                            <th scope="col">TypeRubrique</th>
                                            <th scope="col">TauxSalariale</th>
                                            <th scope="col">TauxPatronale</th>
                                            <th scope="col">MontantPatronale</th>
                                            <th scope="col">MontantSalariale</th>
                                            <th scope="col">Plafond</th>
                                            <th scope="col">CodePostale</th>
                                            <th scope="col">Intitule</th>
                                            <th scope="col">Memo</th>
                                            <th></th>
                                           
                                          </tr>
                                        </thead>
                                        <tbody>

                                            {

                                                allRubriquesData.data.rubriques.data.map((rubrique,index) =>(

                                                  <tr key={index}>
                                                  <td>{rubrique.attributes.IdRub}</td>
                                                  <td>{rubrique.attributes.CodeRubrique}</td>
                                                  <td>{rubrique.attributes.TypeRubrique}</td>
                                                  <td>{rubrique.attributes.TauxSalariale}</td>
                                                  <td>{rubrique.attributes.TauxPatronale}</td>
                                                  <td>{rubrique.attributes.MontantPatronale}</td>
                                                  <td>{rubrique.attributes.MontantSalariale}</td>
                                                  <td>{rubrique.attributes.Plafond}</td>
                                                  <td>{rubrique.attributes.CodePostale}</td>
                                                  <td>{rubrique.attributes.Intitule}</td>
                                                  <td>{rubrique.attributes.Memo}</td>
                                                  
                                                  <td><button className="btn btn-danger rounded">delete</button></td>
                                                  <td><button className="btn btn-primary rounded">update</button></td>
                                                </tr>
                                                                                                          
                                                  ))
                                            }
                                         
                                          
                                         
                                        </tbody>
                                 </table>

                                       
                                   
                                         
                                         ):<h1>Uploader vos Rubriques</h1>:""
                                    }     
                                 

                                 

                                 </div>
                         </div>
                      </Tab>
                      <Tab eventKey="affectation" title="Affectation">
                         <div className="containter-fluid">
                         <div className="row my-9">
                                          {/* <button className="btn btn-primary rounded">Uploader Salariés</button> */}
                                          <div className="col-sm-4">
                                          
                                          {
                                           
                                          allAffectationsData.data?allAffectationsData.data.affectations.data.length>0?"":<input type="file" id="affectations" accept="xlsx,xls" multiple={false} onChange={(e)=> handleFile(e)}/>:""
                                          }
                                          
                                          {
                                              fileNameError!=""?<p className="text-danger">{fileNameError}</p>:""
                                          }
                                          </div>
                                          <div className="col-sm-4">
                                              {
                                                allAffectationsData.data?allAffectationsData.data.affectations.data.length>0?<button className="btn btn-primary rounded">Ajouter une affectation</button>:"":""
                                                 
                                              }
                                               
                                          </div>
                                          <div className="col-sm-4">
                                            {
                                              allAffectationsData.data?allAffectationsData.data.affectations.data.length>0?<button className="btn btn-danger rounded">Supprimer toutes les affectations</button>:"":""
                                                
                                            }
                                                
                                          </div>
                                          
                                 </div>
                                 <div className="row my-2">

                                          
                                    {
                                       allAffectationsData.data?allAffectationsData.data.affectations.data.length>0? (


                                        //  console.log(allSalriesData.data.salaries.data)
                                        <table className="table table-striped table-bordered">
                                        <thead>
                                          <tr>
                                          						
						

                                            <th scope="col">IdAddect</th>
                                            <th scope="col">NumSalarie</th>
                                            <th scope="col">CodeRubrique</th>
                                            <th scope="col">DateHist</th>
                                            <th scope="col">ValeurNombre</th>
                                            <th scope="col">ValeurBase</th>
                                            <th scope="col">ValeurMontant</th>
                                            <th></th>
                                           
                                          </tr>
                                        </thead>
                                        <tbody>

                                            {

                                                allAffectationsData.data.affectations.data.map((affectation,index) =>(

                                                  <tr key={index}>
                                                  <td>{affectation.attributes.IdAddect}</td>
                                                  <td>{affectation.attributes.NumSalarie}</td>
                                                  <td>{affectation.attributes.CodeRubrique}</td>
                                                  <td>{affectation.attributes.DateHist}</td>
                                                  <td>{affectation.attributes.ValeurNombre}</td>
                                                  <td>{affectation.attributes.ValeurBase}</td>
                                                  <td>{affectation.attributes.ValeurMontant}</td>
                                                  
                                                  <td><button className="btn btn-danger rounded">delete</button></td>
                                                  <td><button className="btn btn-primary rounded">update</button></td>
                                                </tr>
                                                                                                          
                                                  ))
                                            }
                                         
                                          
                                         
                                        </tbody>
                                 </table>

                                       
                                   
                                         
                                         ):<h1>Uploader vos Affectations</h1>:""
                                    }     
                                 

                                 

                                 </div>
                         </div>
                      </Tab>
                    </Tabs>

                         
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};