import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // const token = true
    if (!token) {
      navigate("/admin/auth");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return (
    <React.Fragment>{isAuthenticated ? props.children : null}</React.Fragment>
  );
};

export default ProtectedRoute;
