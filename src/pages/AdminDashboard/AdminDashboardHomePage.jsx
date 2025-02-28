import React, { useEffect, useState } from "react";
import DashboardHeader from "component/Layout/AdminDashboard/DashboardHeader";
import { StatsGrid } from "component/Layout/AdminDashboard/StatsCard";
import GraphSection, {
  styles,
} from "component/Layout/AdminDashboard/GraphSection";
import UsersTable from "component/Layout/AdminDashboard/UsersTable";
import { getAllUsersFunApi } from "store/auth/services";
import { useDispatch, useSelector } from "react-redux";
import { getallDocsFunApi } from "store/document/services";

const USERS_PER_PAGE = 10;

const AdminDashboardHomePage = () => {
  const dispatch = useDispatch();
  const { data: usersData } = useSelector((state) => state.auth.allUsers);
  const { data: documentData } = useSelector(
    (state) => state.document.documentAll
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const transformUserDocumentData = (users, documents) => {
    const userDocumentCount = documents.reduce((acc, doc) => {
      acc[doc.userId] = (acc[doc.userId] || 0) + 1;
      return acc;
    }, {});

    return users?.map((user, index) => ({
      name: index + 1,  
      displayName: `${user.firstName} ${user.lastName}`,  
      value: userDocumentCount[user.id] || 0,
      userImage: user.profilePicture || `https://i.pravatar.cc/30?img=${index + 1}`,
    })) || [];
  };

  const transformUserDocumentData2 = (users, documents) => {
    const userDocumentCount = documents.reduce((acc, doc) => {
      acc[doc.userId] = (acc[doc.userId] || 0) + 1;
      return acc;
    }, {});

    return users?.map((user, index) => ({
      name: index + 1,  
      value: userDocumentCount[user.id] || 0,
      userImage: user.profilePicture || `https://i.pravatar.cc/30?img=${index + 1}`,
    })) || [];
  };

  const graphData = transformUserDocumentData(usersData?.users, documentData);
  const graphData2 = transformUserDocumentData2(usersData?.users, documentData);

  const transformedUsers = usersData?.users?.map((user, index) => ({
    userId: user?.id,
    id: `#${10000 + index + 1}`,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    dateCreated: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    phone: user.phone?.number || "N/A",
    userImage: user.profilePicture || `https://i.pravatar.cc/30?img=${index + 1}`,
    value: graphData.find(
      (data) => data.name === index + 1
    )?.value || 0,
  })) || [];

  useEffect(() => {
    fetchUsers();
    dispatch(getallDocsFunApi({ onSuccess: () => {} }));
  }, [currentPage, sortBy, sortOrder]);

  const fetchUsers = () => {
    dispatch(
      getAllUsersFunApi({
        page: currentPage,
        limit: USERS_PER_PAGE,
        allUsers: true,
        sortBy,
        sortOrder,
        onSuccess: () => {}
      })
    );
};

  console.log("transformedUsers", usersData);

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <style>{styles}</style>
      <DashboardHeader />
      <StatsGrid usersData={usersData?.total} />
      <GraphSection data={graphData} data2={graphData2} />
      <UsersTable users={transformedUsers} />
    </div>
  );
};

export default AdminDashboardHomePage;
