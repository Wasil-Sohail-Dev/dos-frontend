import React, { useEffect } from "react";
import { FaUser, FaUsers, FaFileAlt, FaUsersCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdminsFunApi, getAllUsersFunApi } from "store/auth/services";
import { getallDocsFunApi } from "store/document/services";

export const StatsCard = ({ title, value, Icon }) => (
  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className="p-2 md:p-3 rounded-full bg-blue-100 mr-3 md:mr-4">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
      </div>
      <div>
        <p className="text-xl md:text-2xl font-semibold">{value}</p>
        <p className="text-xs md:text-sm text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

export const StatsGrid = ({ usersData }) => {
  console.log("usersData", usersData);
  const documentData = useSelector(
    (state) => state.document.documentAll?.data || []
  );
  const adminsData = useSelector(
    (state) => state.auth.allAdmins?.data || []
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getallDocsFunApi({ onSuccess: () => {} }));
    dispatch(getAllAdminsFunApi({ onSuccess: () => {} }));
  }, [dispatch]);


  const statsCards = [
    { title: "Admin User", value: `${adminsData.length}`, Icon: FaUsersCog },
    {
      title: "Document Received",
      value: `${documentData.length}+`,
      Icon: FaFileAlt,
    },
    { title: "New Users", value: `${usersData||0}+`, Icon: FaUsers },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {statsCards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};
