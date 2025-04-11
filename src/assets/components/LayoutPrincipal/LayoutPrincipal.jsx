import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

const LayoutComNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default LayoutComNavbar;
