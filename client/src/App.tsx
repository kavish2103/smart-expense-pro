import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Expenses from "./pages/Expenses";
import CreateExpense from "./pages/CreateExpense";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import EditExpense from "./pages/EditExpense";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />  

      <Routes>
      <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>

<Route
  path="/register"
  element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  }
/>


        <Route
  path="/create-expense"
  element={
    <ProtectedRoute>
      <CreateExpense />
    </ProtectedRoute>
  }
/>

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
  path="/expenses/edit/:id"
  element={
    <ProtectedRoute>
      <EditExpense />
    </ProtectedRoute>
  }
/>


        <Route
          path="/expenses/new"
          element={
            <ProtectedRoute>
              <CreateExpense />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
