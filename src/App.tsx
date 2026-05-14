import { BrowserRouter } from "react-router-dom";
import "./style.css";
import { AppRoutes } from "./routes/AppRoutes";
import Preloader from "./components/common/Preloader";
import { ReLoginModal } from "./components/common/ReLoginModal";

function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <AppRoutes />
      <ReLoginModal />
    </BrowserRouter>
  );
}

export default App;
