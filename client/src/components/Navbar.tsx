import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <h3>Smart Expense</h3>

      {token ? (
        <>
          <button onClick={() => navigate("/expenses")}>Expenses</button>
          <button onClick={() => navigate("/summaries")}>Summaries</button>
          <button onClick={() => navigate("/ai-adviser")}>AI Adviser</button>
          <button onClick={() => navigate("/create-expense")}>
            Add Expense
          </button>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
