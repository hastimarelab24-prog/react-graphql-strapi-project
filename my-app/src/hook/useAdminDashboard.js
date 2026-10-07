import { useContext } from "react";

import {
  AdminDashboardContext,
} from "../context/AdminDashboardContext";

const useAdminDashboard = () => {
  const context = useContext(
    AdminDashboardContext
  );

  if (!context) {
    throw new Error(
      "useAdminDashboard must be used inside AdminDashboardProvider"
    );
  }

  return context;
};

export default useAdminDashboard;