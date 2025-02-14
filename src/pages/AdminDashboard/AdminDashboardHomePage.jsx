import React, { useEffect } from "react";
import DashboardHeader from "component/Layout/AdminDashboard/DashboardHeader";
import { StatsGrid } from "component/Layout/AdminDashboard/StatsCard";
import GraphSection, {
  styles,
} from "component/Layout/AdminDashboard/GraphSection";
import UsersTable from "component/Layout/AdminDashboard/UsersTable";
import { getAllUsersFunApi } from "store/auth/services";
import { useDispatch, useSelector } from "react-redux";
import { getallDocsFunApi } from "store/document/services";

// Main Component
const AdminDashboardHomePage = () => {
  const dispatch = useDispatch();
  const { data: allUsers } = useSelector((state) => state.auth.allUsers);
  const { data: documentData } = useSelector(
    (state) => state.document.documentAll
  );

  const transformUserDocumentData = (users, documents) => {
    const userDocumentCount = documents.reduce((acc, doc) => {
      acc[doc.userId] = (acc[doc.userId] || 0) + 1;
      return acc;
    }, {});
    console.log("userDocument 23", userDocumentCount);

    return users.map((user, index) => ({
      name: index + 1,  // Use index for X-axis positioning
      displayName: `${user.firstName} ${user.lastName}`,  // For display purposes
      value: userDocumentCount[user.id] || 0,
      userImage: user.profilePicture || `https://i.pravatar.cc/30?img=${index + 1}`,
    }));
  };

  // Transform data for graph
  const graphData = transformUserDocumentData(allUsers, documentData);

  const transformUserDocumentData2 = (users, documents) => {
    const userDocumentCount = documents.reduce((acc, doc) => {
      acc[doc.userId] = (acc[doc.userId] || 0) + 1;
      return acc;
    }, {});
    console.log("userDocument 23", userDocumentCount);

    return users.map((user, index) => ({
      name: index + 1,  // Use index for X-axis positioning
      value: userDocumentCount[user.id] || 0,
      userImage: user.profilePicture || `https://i.pravatar.cc/30?img=${index + 1}`,
    }));
  };

  // Transform data for graph
  const graphData2 = transformUserDocumentData2(allUsers, documentData);

  // Transform data for table (keeping existing format)
  const transformedUsers = allUsers.map((user, index) => ({
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
    value:
      graphData.find(
        (data) => data.name === `${user.firstName} ${user.lastName}`
      )?.value || 0,
  }));

  useEffect(() => {
    dispatch(getAllUsersFunApi({ onSuccess: () => {} }));
    dispatch(getallDocsFunApi({ onSuccess: () => {} }));
  }, [dispatch]);

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <style>{styles}</style>
      <DashboardHeader />
      <StatsGrid />
      <GraphSection data={graphData} data2={graphData2} />
      <UsersTable users={transformedUsers} />
    </div>
  );
};

export default AdminDashboardHomePage;
