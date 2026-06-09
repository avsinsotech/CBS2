import "../styles/navbar.css";

/* IMPORT LOGO */

import logo from "../assets/logo.png";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  
  const userName = user?.user?.userName || user?.user?.loginCode || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (

    <div className="navbar">

      {/* LEFT SECTION */}

      <div className="navbar-left">

        {/* LOGO */}

        <div className="navbar-logo">

          <img
            src={logo}
            alt="logo"
            className="logo-image"
          />

        </div>

        {/* TITLE */}

        <div className="navbar-title-section">

          <span className="navbar-title">
            CBS PORTAL
          </span>

          <span className="navbar-subtitle">
            Banking Management System
          </span>

        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="navbar-right">

        {/* SEND QUERY */}

        <button className="nav-btn secondary-btn">
          Send Query
        </button>

        {/* ONLINE SUPPORT */}

        <button className="nav-btn support-btn">
          Online Support
        </button>

        {/* DATE */}

        <div className="navbar-date">
          {new Date().toLocaleDateString('en-GB')}
        </div>

        {/* USER */}

        <div className="user-profile">

          <div className="user-avatar">
            {avatarLetter}
          </div>

          <div className="user-details">

            <span className="user-name">
              {userName}
            </span>

            <span className="user-role">
              Administrator
            </span>

          </div>

        </div>

        {/* LOGOUT */}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;