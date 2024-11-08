import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home></Home>
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Login></Login>} />
            <Route path="register" element={<Register></Register>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
