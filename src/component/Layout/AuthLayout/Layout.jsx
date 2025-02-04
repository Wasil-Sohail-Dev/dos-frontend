import {Outlet} from "react-router"

export const AuthLayout = () => {
    return (
      <>
          <main className="flex-1  overflow-auto">
            <Outlet />
          </main>
      </>
    );
  };