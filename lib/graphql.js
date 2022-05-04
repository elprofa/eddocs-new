
import gql from "graphql-tag";

export const LISTE_DOCUMENTS=gql`
    query { 
        documents
    { 
        data{ 
            id
        attributes{ 
            code
            libelle
        }
        }
    }
    }
`;

export const GET_USER = gql`
                 mutation login($identifier:String! $password:String!){
                  
                    login(input:{identifier:$identifier,password:$password}){
                    
                        jwt
                        user{
                          
                          email
                          username
                          id
                          
                        }
                        
                      
                  }
                    
                  }
 
`;
// filters:{responsable:{username:{eq:"chris"} ,id:{eq:1}}}

export const GET_SOCIETE = gql`

      query societes($username:String! $id:ID!){
                societes(filters:{responsable:{username:{eq:$username},id:{eq:$id}}}){

                     data{
                           id
                     }
                }
             
      }

`;

export const CREATE_SALARIE = gql`

mutation createSalarie($data:SalarieInput!){
     
    createSalarie(data:$data){
   
          data{
                 id
        
          }
  
  
}
  
}

`;

export const CREATE_RUBRIQUE = gql`

mutation createRubrique($data:RubriqueInput!){
     
    createRubrique(data:$data){
   
          data{
                 id
        
          }
  
  
}
  
}

`;
export const CREATE_AFFECTATION = gql`

mutation createAffectation($data:AffectationInput!){
     
    createAffectation(data:$data){
   
          data{
                 id
        
          }
  
  
}
  
}

`;

export const GET_ALL_SALARIES = gql`

query salaries($id:ID!){
  
    salaries(filters:{societe:{id:{eq:$id}}}){
   
   
          data{
           
               id
               attributes{
                 
                    Matricule
                    Civilite
                    Nom
                    Prenom
                    NomJeuneFille
                    Rue 
                    Commune
                    SituationFamiliale
                    Statut
                    CodePostale
                    NumSalarie
                    DateDebutService
                    DateFinService
                    societe{
                       data{
                          id
                       }
                   }
                    
               }
         }
   
   
    
 }
     
 
 
}


`;

export const GET_ALL_RUBRIQUES = gql`

query rubriques($id:ID!){
  
    rubriques(filters:{societe:{id:{eq:$id}}}){
   
   
          data{
           
               id
               attributes{
                 
                        IdRub
                        CodeRubrique 
                        TypeRubrique 
                        TauxSalariale 
                        TauxPatronale 
                        MontantPatronale
                        MontantSalariale
                        Plafond
                        CodePostale
                        Intitule
                        Memo
                    societe{
                       data{
                          id
                       }
                   }
                    
               }
         }
   
   
    
 }
     
 
 
}


`;

export const GET_ALL_AFFECTATIONS = gql`

query affectations($id:ID!){
  
    affectations(filters:{societe:{id:{eq:$id}}}){
   
   
          data{
           
               id
               attributes{
                 
                        IdAddect  
                        NumSalarie
                        ValeurBase
                        ValeurNombre
                        ValeurMontant
                        CodeRubrique
                        DateHist
                    societe{
                       data{
                          id
                       }
                   }
                    
               }
         }
   
   
    
 }
     
 
 
}


`;

