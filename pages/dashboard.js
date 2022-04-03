import React from "react";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper";
import { Select } from "../components/Core";
import * as XLSX from "xlsx";

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from "next/router";

import { LISTE_DOCUMENTS } from "../lib/graphql";
import { AuthContext } from "../context/Auth";

const defaultJobs = [
  { value: "pd", label: "Product Designer" },
  { value: "gd", label: "Graphics Designer" },
  { value: "fd", label: "Frontend Developer" },
  { value: "bd", label: "Backend Developer" },
  { value: "cw", label: "Content Writer" },
];

export default function Dashboard () {

  const router = useRouter();
  const authContext = React.useContext(AuthContext);

  
  
// React.useEffect(() => {
 
//   const userinfo = JSON.parse(localStorage.getItem("userinfo"));
  
//   if(!userinfo){

//     router.push("/");
// }
//   }, []);

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


  const {data,error,loading}=useQuery(LISTE_DOCUMENTS);

  // console.log(error)

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
              <div className="row mb-11 align-items-center">
                <div className="col-lg-6 mb-lg-0 mb-4">
                  <h3 className="font-size-6 mb-0">Posted Jobs (4)</h3>
                </div>
                <div className="col-lg-6">
                  <div className="d-flex flex-wrap align-items-center justify-content-lg-end">
                    <p className="font-size-4 mb-0 mr-6 py-2">Filter by Job:</p>
                    <div className="h-px-48">
                      <Select
                        options={defaultJobs}
                        className="pl-0 h-100 arrow-3 arrow-3-black min-width-px-273  text-black-2 d-flex align-items-center w-100"
                        border={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-8 pt-7 rounded pb-9 px-11">
                <div className="table-responsive ">
                  <input type="file" onChange={onChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};