import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();
  
  // ONLY show Navbar on Home page (path "/")
  const showNavbar = location.pathname === "/";
  
  return (
    <div style={{ margin: 0, padding: 0, width: "100%" }}>
      {showNavbar && <Navbar />}
      <AppRoutes />
    </div>
  );
}

export default App;



