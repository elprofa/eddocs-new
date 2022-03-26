import React from "react";
import Link from "next/link";
import PageWrapper from "../../components/PageWrapper";
import { Select } from "../../components/Core";
import imgF1 from "../../assets/image/l2/png/featured-job-logo-1.png";
import iconD from "../../assets/image/svg/icon-dolor.svg";
import iconB from "../../assets/image/svg/icon-briefcase.svg";
import iconL from "../../assets/image/svg/icon-location.svg";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { MyServer } from "../../config";

const defaultJobs = [
  { value: "pd", label: "Plus récent" },
  { value: "gd", label: "Plus ancien" },
  { value: "fd", label: "Ordre croissant" },
  { value: "bd", label: "Ordres decroissant" },
];

const LISTE_ONE_CONTRACTEUR=gql`
    query LISTE_ONE_CONTRACTEUR($id:ID!) { 
      contracteur(id:$id)
      {
        id
        sigle
        nif
        forme_juridique
        telephone
        raison_sociale
        adresse_email
        logo{
            url
        }
      }
    }
`;

const LISTE_RECOLTE_CONTRACTEUR=gql`
    query LISTE_RECOLTE_CONTRACTEUR($id:ID!) { 
      
        recoltes(where:{contracteur:{id:$id}})
        {
            id
            quantite
            bloc
            { 
                id
                libelle
                emplacement
                estate
                {
                    id
                    libelle
                }
            }
        }
    }
`;

export default function DashboardDetailContracteur ({query}) {

    const {data,error,loading}=useQuery(LISTE_ONE_CONTRACTEUR,{
        variables:{
            id:query.id
        }
    });
    
    const result=useQuery(LISTE_RECOLTE_CONTRACTEUR,{
        variables:{
            id:query.id
        }
    })


    if(loading || result.loading){
        return <p>Loading</p>
    }
    if(error || result.error){
        return <p>Erreur</p>
    }

    const contracteur=data?.contracteur
    const details=result.data?.recoltes


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
              <div className="row justify-content-center">
                    {/* <!-- back Button --> */}
                    <div className="col-xl-12 col-lg-11 ml-xxl-32 ml-xl-15 dark-mode-texts">
                        <div className="mb-9">
                        <Link href="/">
                            <a className="d-flex align-items-center ml-4">
                            <i className="icon icon-small-left bg-white circle-40 mr-5 font-size-7 text-black font-weight-bold shadow-8"></i>
                            <span className="text-uppercase font-size-3 font-weight-bold text-gray">
                                Gestion des contracteurs {query.id}
                            </span>
                            </a>
                        </Link>
                        </div>
                    </div>
                    {/* <!-- back Button End --> */}
                    <div className="col-xl-12 col-lg-12 mb-8 px-xxl-15 px-xl-0">
                        <div className="bg-white rounded-4 border border-mercury shadow-9">
                        {/* <!-- Single Featured Job --> */}
                        <div className="pt-9 pl-sm-9 pl-5 pr-sm-9 pr-5 pb-8 border-bottom border-width-1 border-default-color light-mode-texts">
                            <div className="row">
                            <div className="col-md-6">
                                {/* <!-- media start --> */}
                                <div className="media align-items-center">
                                {/* <!-- media logo start --> */}
                                <div className="square-72 d-block mr-8">
                                    <img src={MyServer+contracteur.logo.url} alt="" width={90} />
                                </div>
                                {/* <!-- media logo end --> */}
                                {/* <!-- media texts start --> */}
                                <div>
                                    <h3 className="font-size-6 mb-0">
                                        {
                                            contracteur.raison_sociale
                                        }
                                        (
                                            {
                                                " "+contracteur.sigle
                                            }
                                        )
                                    </h3>
                                    <span className="font-size-3 text-gray line-height-2">
                                    {contracteur.nif}
                                    </span>
                                </div>
                                {/* <!-- media texts end --> */}
                                </div>
                                {/* <!-- media end --> */}
                            </div>
                            <div className="col-md-6 text-right pt-7 pt-md-0 mt-md-n1">
                                {/* <!-- media date start --> */}
                                <div className="media justify-content-md-end">
                                    <p className="font-size-4 text-gray mb-0" style={{display:"block"}}>
                                    {contracteur.adresse_email}
                                    </p> <br />
                                </div>
                                <div className="media justify-content-md-end">
                                    <p className="font-size-4 text-gray mb-0" style={{display:"block"}}>
                                    {contracteur.telephone}
                                    </p> <br />
                                </div>
                                <div className="media justify-content-md-end">
                                    <p className="font-size-4 text-gray mb-0" style={{display:"block"}}>
                                    {contracteur.forme_juridique}
                                    </p> <br />
                                </div>
                                {/* <!-- media date end --> */}
                            </div>
                            </div>
                            <div className="row pt-9">
                            <div className="col-12">
                                {/* <!-- card-btn-group start --> */}
                                <div className="card-btn-group">
                                <Link href="/#">
                                    <a className="btn btn-green text-uppercase btn-medium rounded-3 w-180 mr-4 mb-5">
                                    Nouvelle recolte
                                    </a>
                                </Link>
                                <Link href="/#">
                                    <a className="btn btn-outline-mercury text-black-2 text-uppercase h-px-48 rounded-3 mb-5 px-5">
                                    <i className="icon icon-bookmark-2 font-weight-bold mr-4 font-size-4"></i>{" "}
                                       Modifier
                                    </a>
                                </Link>
                                </div>
                                {/* <!-- card-btn-group end --> */}
                            </div>
                            </div>
                        </div>
                        {/* <!-- End Single Featured Job --> */}
                        <div className="job-details-content pt-8 pl-sm-9 pl-6 pr-sm-9 pr-6 pb-10 border-bottom border-width-1 border-default-color light-mode-texts">
                            <div className="row mb-7">
                            <div className="col-md-4 mb-md-0 mb-6">
                                <div className="media justify-content-md-start">
                                    <div className="image mr-5">
                                        <img src={iconD.src} alt="" />
                                    </div>
                                    <p className="font-weight-semibold font-size-5 text-black-2 mb-0">
                                    Total recolte: 0 
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4 pr-lg-0 pl-lg-10 mb-md-0 mb-6">
                                <div className="media justify-content-md-start">
                                <div className="image mr-5">
                                    <img src={iconB.src} alt="" />
                                </div>
                                <p className="font-weight-semibold font-size-5 text-black-2 mb-0">
                                    Demande de recolte: 0
                                </p>
                                </div>
                            </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <p>Liste des recoltes de {contracteur.raison_sociale}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                <table className="table table-striped table-hover">
                                    <thead style={{borderBottom:".5px solid #ccc"}}>
                                    <tr>
                                        <th scope="col" className="pl-0 border-0 font-size-4 font-weight-normal">
                                            Quantité
                                        </th>
                                        <th scope="col" className="pl-4 border-0 font-size-4 font-weight-normal">
                                            Block
                                        </th>
                                        <th scope="col" className="pl-4 border-0 font-size-4 font-weight-normal">
                                            Estate
                                        </th>
                                        
                                        <th scope="col" className="pl-4 border-0 font-size-4 font-weight-normal"></th>
                                        <th scope="col" className="pl-4 border-0 font-size-4 font-weight-normal"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        result.data!=="undefined" ?(
                                        details.map((recole,index)=>(
                                            
                                            <tr className="border border-color-2" key={"LigneTableContracteurDetail"+index}>
                                            
                                                <th
                                                scope="row"
                                                className="pl-6 border-0 py-7 min-width-px-235"
                                                >
                                                <div className="">
                                                    <Link href={"/dashboard-detail-recolte/"+contracteur.id}>
                                                    <a className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                                        {
                                                            recole.quantite
                                                        }
                                                    </a>
                                                    </Link>
                                                </div>
                                                </th>
                                                <td className="table-y-middle py-7 min-width-px-135">
                                                    <Link href={"/dashboard-detail-bloc/"+contracteur.id}>
                                                        <a className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                                            {
                                                                recole.bloc.libelle
                                                            }
                                                        </a>
                                                    </Link> 
                                                </td>
                                                <td className="table-y-middle py-7 min-width-px-125">
                                                    <Link href={"/dashboard-detail-estate/"+contracteur.id}>
                                                        <a className="font-size-4 mb-0 font-weight-semibold text-black-2">
                                                            {
                                                                recole.bloc.estate.libelle
                                                            }
                                                        </a>
                                                    </Link>
                                                </td>
                                                
                                                <td className="table-y-middle py-7 min-width-px-80">
                                                    <a
                                                        href={"/dashboard-detail-recolte/"+contracteur.id}
                                                        className="font-size-3 font-weight-bold text-green text-uppercase"
                                                    >
                                                        Détail
                                                    </a>
                                                </td>
                                                <td className="table-y-middle py-7 min-width-px-100">
                                                <a
                                                    href="/#"
                                                    className="font-size-3 font-weight-bold text-red-2 text-uppercase"
                                                >
                                                    Delete
                                                </a>
                                                </td>
                                            </tr>
                                        ))
                                        ):(<>eheheheh</>)
                                    }  
                                    </tbody>
                                </table>
                                </div>         
                            </div>
                        </div>
                       
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};