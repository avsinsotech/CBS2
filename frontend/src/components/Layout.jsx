import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "../styles/layout.css";

function Layout() {

  return (

    <div className="layout-wrapper">

      {/* TOP NAVBAR */}

      <Navbar />

      {/* BODY SECTION */}

      <div className="layout-body">

        {/* SIDEBAR */}

        <Sidebar />

        {/* PAGE CONTENT */}

        <div className="main-content">

          <div className="page-content">
            <Outlet />
          </div>

        </div>

      </div>

    </div>

  );

}

export default Layout;