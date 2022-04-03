
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