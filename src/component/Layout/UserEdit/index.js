import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { UserForm } from "./UserForm";

export default function EditUserPage() {
//   const {  } = useSelector((state) => state.manager);

//   const [managerData, setManagerData] = useState();
//   const [isLoading, setIsLoading] = useState(true);
  //   useEffect(() => {
  //     console.log("ID:", id);
  //   }, [id]);

  //   useEffect(() => {
  //     if (router.query.id) {
  //       const manager = managers.find(
  //         (manager) => manager.id === router.query.id
  //       );

  //       if (manager) {
  //         setManagerData(manager);
  //         setIsLoading(false);
  //       }
  //     }
  //   }, [managers, router.query.id]);

  return (
    <>
      <div>
        <h1>Edit User Details</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Edit User Details</li>
        </ul>
      </div>
      {/* {isLoading ? <p>Loading...</p> : <UserForm />} */}
    </>
  );
}
