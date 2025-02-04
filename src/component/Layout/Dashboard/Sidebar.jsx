import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { IoIosDocument } from "react-icons/io";
import { MdSummarize } from "react-icons/md";
import { MdEditDocument } from "react-icons/md";
import { FaCommentDots, FaUser } from "react-icons/fa";
import { HiDocumentSearch } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { IoIosHelpCircle } from "react-icons/io";
import { FaWallet, FaShoppingCart, FaCrown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutFunApi } from "store/auth/services";

const sidebarList = [
  {
    name: "Dashboard",
    icon: <RxDashboard />,
    link: "/",
  },
  {
    name: "Document Management",
    icon: <IoIosDocument />,
    link: "/document-managment",
  },
  {
    name: "Summaries",
    icon: <MdEditDocument />,
    link: "/document-summeries",
  },
  {
    name: "User Profile",
    icon: <FaUser />,
    link: "/profile-update",
  },
  {
    name: "Document Overview",
    icon: <HiDocumentSearch />,
    link: "/document-overview",
  },
  {
    name: "Settings",
    icon: <IoSettingsSharp />,
    link: "/setting",
  },
  {
    name: "Ask Questions to AI",
    icon: <FaCommentDots />,
    link: "/chat",
  },
  {
    name: "Help Center",
    icon: <IoIosHelpCircle />,
    link: "/help-center",
  },
];

export const SideBarDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(
      logoutFunApi({
        onSuccess: () => {
          navigate("/login");
        },
      })
    );
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white"
        onClick={handleToggle}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:block w-[280px] shadow-xl`}
      >
        <div className="p-6 text-[#378AF2] text-[36px] font-bold">Logo Here</div>

        <nav className="h-[calc(100vh-96px)] overflow-y-auto">
          <ul className="space-y-2 px-4">
            {sidebarList.map((item, index) => {
              const isActive = location.pathname === item.link;

              return (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`flex items-center py-3 px-4 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-[#378AF2] text-white"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <span className="mr-4">
                      {React.cloneElement(item.icon, {
                        color: isActive ? "white" : "#3A8EF6",
                        size: 20,
                      })}
                    </span>
                    <span className="text-[16px]">{item.name}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center py-3 px-4 rounded-lg cursor-pointer transition-colors text-gray-400 hover:bg-gray-50"
              >
                <span className="mr-4">
                  <TbLogout color="#3A8EF6" size={20} />
                </span>
                <span className="text-[16px]">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};
