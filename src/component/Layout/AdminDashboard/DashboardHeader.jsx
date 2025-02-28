import React from 'react';

const DashboardHeader = () => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
    <h1 className="text-lg md:text-xl font-bold">Dashboard</h1>
    {/* <div className="flex items-center gap-2 w-full sm:w-auto">
      <input
        type="date"
        className="border rounded-md px-2 py-1 text-gray-700 text-sm w-full sm:w-auto"
        defaultValue="2021-08-10"
      />
      <span className="text-gray-500">~</span>
      <input
        type="date"
        className="border rounded-md px-2 py-1 text-gray-700 text-sm w-full sm:w-auto"
        defaultValue="2021-10-10"
      />
    </div> */}
  </header>
);

export default DashboardHeader; 