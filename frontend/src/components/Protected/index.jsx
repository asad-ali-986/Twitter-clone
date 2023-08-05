import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Protected = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};
export default Protected;