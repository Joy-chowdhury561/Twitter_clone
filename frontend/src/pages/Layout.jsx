import Sidebar from "../components/common/SideBar";
import RightPanel from "../components/common/RightPanel";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="flex  ">
        <Sidebar />
        <Outlet />
        <RightPanel />
      </div>
    </>
  );
};

export default Layout;
