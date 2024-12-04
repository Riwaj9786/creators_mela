import TopNav from "../../Components/Navbar/TopNav";
import FooterBottom from "../../Components/Footer/FooterBottom";
import Apply from "../../Components/HomePageComponents/Apply";
import BGImage from "../../assets/Images/BackgroundImage.jpg";
import Animation from "../../assets/Images/Animation.gif";
import SECBG from "../../assets/Images/section-2-bg.png";

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
        <section className="bg-transparent flex justify-around mr-[130px]">
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
        <section className="bg-transparent flex justify-around ml-[130px] mr-[130px]">
          <div className="flex flex-col pt-[131px]">
            <h1 className="font-[700] text-[84px] leading-none text-[#F4C4D1] max-w-[1150px]">
              WHAT IS CREATOR'S MELA?
            </h1>
            <p className="font-[700] text-[40px] leading-none text-[#FFFFFF] max-w-[1150px] pt-[64px]">
              Creator’s Mela is a digital conference designed to sharpen and
              develop the skills of current and aspiring Nepali digital creators
              and influencers, and to launch and grow their online presence or
              businesses. Last year, we had over 1,500 content creators join the
              first-of-its-kind in-person event to network, experience the music
              festival-inspired main stage and immersive creator zone, and to
              level-up their skills through the 17 interactive sessions on
              topics like brand-building, financial literacy, and content
              development!
            </p>
            <div className="pt-[134px] pb-[66px]">
              <button className="text-white bg-[#CC065B] rounded-[84px] h-[80px] w-[269px] ">
                Learn More
              </button>
            </div>
          </div>
        </section>
        <section className="relative h-[825px]">
          <div
            className="absolute inset-0 bg-center"
            style={{
              backgroundImage: `url(${SECBG})`,
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="relative z-10 text-white p-6 flex flex-col justify-end h-full">
            <h1 className="text-2xl md:text-3xl font-semibold">
              How to be part of Creator’s Mela 2024
            </h1>
            <ol className="mt-4 space-y-2">
              <li>
                <span className="font-bold">1.</span> Apply to join at
                usembassynepal.events
              </li>
              <li>
                <span className="font-bold">2.</span> Once selected, download
                the "Creator’s Mela" apps.
              </li>
              <li>
                <span className="font-bold">3.</span> Choose your preferred
                session.
              </li>
              <li>
                <span className="font-bold">4.</span> Attend Creator’s Mela
                2024!
              </li>
            </ol>
          </div>
        </section>
      </div>
      <FooterBottom />
    </div>
  );
};

export default HomePage;
