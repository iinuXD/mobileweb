import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { authService } from "../auth/auth-service";
import type { AuthUser } from "../auth/auth-interface";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

  if (user === undefined) return null;

  if (!user) return <Redirect to="/login" />;

  return children;
};

export default PrivateRoute;
