import TopNav from "../../Components/Navbar/TopNav";
import FooterBottom from "../../Components/Footer/FooterBottom";
import Apply from "../../Components/HomePageComponents/Apply";
import BGImage from "../../assets/Images/BackgroundImage.jpg";
import Animation from "../../assets/Images/Animation.gif";

const HomePage = () => {
  return (
    <div>
      <TopNav />
      <div
        style={{
          backgroundImage: `url(${BGImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <section className="bg-transparent flex justify-around mx-[130px]">
          <div className=" overflow-hidden rounded-md">
            <img
              src={Animation}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Apply />
          </div>
        </section>
      </div>
      <FooterBottom />
    </div>
  );
};

export default HomePage;
