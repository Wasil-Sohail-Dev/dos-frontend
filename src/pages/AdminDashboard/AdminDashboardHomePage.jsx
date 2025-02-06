import React from 'react';
import DashboardHeader from 'component/Layout/AdminDashboard/DashboardHeader';
import { StatsGrid } from 'component/Layout/AdminDashboard/StatsCard';
import GraphSection, { styles } from 'component/Layout/AdminDashboard/GraphSection';
import UsersTable from 'component/Layout/AdminDashboard/UsersTable';

// Main Component
const AdminDashboardHomePage = () => {
  // Sample data
 const data = [
    { name: '1', value: 180, userImage: 'https://i.pravatar.cc/30?img=1' },
    { name: '2', value: 200, userImage: 'https://i.pravatar.cc/30?img=2' },
    { name: '3', value: 130, userImage: 'https://i.pravatar.cc/30?img=3' },
    { name: '4', value: 90, userImage: 'https://i.pravatar.cc/30?img=4'  },
    { name: '5', value: 30, userImage: 'https://i.pravatar.cc/30?img=5' },
    { name: '6', value: 110, userImage: 'https://i.pravatar.cc/30?img=6' },
    { name: '7', value: 180, userImage: 'https://i.pravatar.cc/30?img=7' },
    { name: '8', value: 90, userImage: 'https://i.pravatar.cc/30?img=8' },
    { name: '9', value: 100, userImage: 'https://i.pravatar.cc/30?img=9' },
    { name: '10', value: 170, userImage: 'https://i.pravatar.cc/30?img=10' },
    { name: '11', value: 210, userImage: 'https://i.pravatar.cc/30?img=11' },
    { name: '12', value: 180, userImage: 'https://i.pravatar.cc/30?img=12' },
    { name: '13', value: 200, userImage: 'https://i.pravatar.cc/30?img=13' },
    { name: '14', value: 250, userImage: 'https://i.pravatar.cc/30?img=14' },
    { name: '15', value: 180, userImage: 'https://i.pravatar.cc/30?img=15' },
    { name: '16', value: 160, userImage: 'https://i.pravatar.cc/30?img=16' },
    { name: '17', value: 140, userImage: 'https://i.pravatar.cc/30?img=17' },
    { name: '18', value: 120, userImage: 'https://i.pravatar.cc/30?img=18' },
    { name: '19', value: 190, userImage: 'https://i.pravatar.cc/30?img=19' },
    { name: '20', value: 220, userImage: 'https://i.pravatar.cc/30?img=20' },
    { name: '21', value: 170, userImage: 'https://i.pravatar.cc/30?img=21' },
    { name: '22', value: 150, userImage: 'https://i.pravatar.cc/30?img=22' },
    { name: '23', value: 130, userImage: 'https://i.pravatar.cc/30?img=23' },
    { name: '24', value: 160, userImage: 'https://i.pravatar.cc/30?img=24' },
    { name: '25', value: 200, userImage: 'https://i.pravatar.cc/30?img=25' },
    { name: '26', value: 180, userImage: 'https://i.pravatar.cc/30?img=26' },
    { name: '27', value: 140, userImage: 'https://i.pravatar.cc/30?img=27' },
    { name: '28', value: 120, userImage: 'https://i.pravatar.cc/30?img=28' },
    { name: '29', value: 190, userImage: 'https://i.pravatar.cc/30?img=29' },
    { name: '30', value: 210, userImage: 'https://i.pravatar.cc/30?img=30' },
    { name: '31', value: 170, userImage: 'https://i.pravatar.cc/30?img=31' },
    { name: '32', value: 150, userImage: 'https://i.pravatar.cc/30?img=32' },
    { name: '33', value: 130, userImage: 'https://i.pravatar.cc/30?img=33' },
    { name: '34', value: 160, userImage: 'https://i.pravatar.cc/30?img=34' },
    { name: '35', value: 200, userImage: 'https://i.pravatar.cc/30?img=35' },
    { name: '36', value: 180, userImage: 'https://i.pravatar.cc/30?img=36' },
    { name: '37', value: 140, userImage: 'https://i.pravatar.cc/30?img=37' },
    { name: '38', value: 120, userImage: 'https://i.pravatar.cc/30?img=38' },
    { name: '39', value: 190, userImage: 'https://i.pravatar.cc/30?img=39' },
    { name: '40', value: 210, userImage: 'https://i.pravatar.cc/30?img=40' },
    { name: '41', value: 170, userImage: 'https://i.pravatar.cc/30?img=41' },
    { name: '42', value: 150, userImage: 'https://i.pravatar.cc/30?img=42' },
    { name: '43', value: 130, userImage: 'https://i.pravatar.cc/30?img=43' },
    { name: '44', value: 160, userImage: 'https://i.pravatar.cc/30?img=44' },
    { name: '45', value: 200, userImage: 'https://i.pravatar.cc/30?img=45' },
    { name: '46', value: 180, userImage: 'https://i.pravatar.cc/30?img=46' },
    { name: '47', value: 140, userImage: 'https://i.pravatar.cc/30?img=47' },
    { name: '48', value: 120, userImage: 'https://i.pravatar.cc/30?img=48' },
    { name: '49', value: 190, userImage: 'https://i.pravatar.cc/30?img=49' },
    { name: '50', value: 210, userImage: 'https://i.pravatar.cc/30?img=50' }
  ];

  const users = [
    {
      id: '#11232',
      name: 'Munaaza Arshad',
      email: 'xyz@gmail.com',
      dateCreated: 'Apr 24, 2022',
      phone: '0434838490'
    },
    {
      id: '#11233',
      name: 'Talha Baig',
      email: 'xyz@gmail.com',
      dateCreated: 'Apr 24, 2022',
      phone: '0434838490'
    },
    {
      id: '#11234',
      name: 'Arifa Anwar',
      email: 'xyz@gmail.com',
      dateCreated: 'Apr 24, 2022',
      phone: '0434838490'
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      <style>{styles}</style>
      <DashboardHeader />
      <StatsGrid />
      <GraphSection data={data} />
      <UsersTable users={users} />
    </div>
  );
};

export default AdminDashboardHomePage;