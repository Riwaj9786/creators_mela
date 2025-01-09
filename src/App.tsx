import "../src/App.css";
import BGImage from "../src/assets/Images/BackgroundImage.jpg";
import AppRoutes from "./Routes/AppRoutes";

const App: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${BGImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="min-h-screen ">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;
