import TopNav from "../../Components/Navbar/TopNav";
import FooterBottom from "../../Components/Footer/FooterBottom";
import Apply from "../../Components/HomePageComponents/Apply";
import BGImage from "../../assets/Images/BackgroundImage.jpg";
import Animation from "../../assets/Images/Animation.gif";
import SECBG from "../../assets/Images/section-2-bg.png";
import ArtistCard from "../../Components/ArtistCard/ArtistCard";
import FAQ from "../../Components/FAQs/FAQs";
import { ContentCreators } from "../../assets/ComponentsData/ContentCreator";
import Marquee from "react-fast-marquee";
import Banner from "../../assets/Icons/Banner.svg";

const HomePage = () => {
  const Creators = ContentCreators;

  const textContent = ["Aloft Hotel, Kathmandu", "July 26 & 27, 2024"];
  const bannerImages = [Banner, Banner];

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
        <div className="-rotate-6 w-[150%] ">
          <Marquee speed={100} className="bg-[#E8483F]  ">
            {[...Array(4)].map((_, idx) =>
              textContent.map((text, index) => (
                <div
                  key={`${idx}-${index}`}
                  className=" text-[24px] font-[700] p-5 text-white flex gap-[84px]"
                >
                  <img src={bannerImages[index]} alt={`banner ${index + 1}`} />
                  <p>{text}</p>
                </div>
              ))
            )}
          </Marquee>
        </div>
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
          <div className="flex justify-center w-full">
            <div className="absolute h-[825px]">
              <img src={SECBG} alt="" className=" w-[600px] h-full" />
            </div>
          </div>
          <div className="relative z-10 text-white p-6 flex flex-col h-full">
            <div className="flex justify-between">
              <h1 className="text-[104px] leading-none font-[700] mt-[10%] w-[679px] ">
                How to be part of Creator’s Mela 2024
              </h1>
              <ol className="pt-[2%] pl-[200px] w-[40%] h-[50%] leading-none ">
                <li>
                  <span className=" text-[#E8483F] text-[80px]">1.</span>
                  <span className="font-[500] text-[32px]">
                    Apply to join at usembassynepal.events
                  </span>
                </li>
                <li>
                  <span className=" text-[#E8483F] text-[80px]">2.</span>
                  <span className="font-[500] text-[32px]">
                    Onceselected, download the "Creator’s Mela" apps.
                  </span>
                </li>
                <li>
                  <span className=" text-[#E8483F] text-[80px]">3.</span>
                  <span className="font-[500] text-[32px]">
                    Choose your preferred session.
                  </span>
                </li>
                <li>
                  <span className=" text-[#E8483F] text-[80px]">4.</span>
                  <span className="font-[500] text-[32px]">
                    {" "}
                    Attend Creator’s Mela 2024!
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </section>
        <section>
          {/* Performers section */}
          <div>
            <h1 className="text-[#F4C4D1] text-[84px] font-[700]">
              Performers
            </h1>
            <ArtistCard />
          </div>
        </section>
        <section>
          {/* Speakers section */}
          <div>
            <h1 className="text-[#F4C4D1] text-[84px] font-[700]">Speakers</h1>
            <ArtistCard />
          </div>
        </section>
        <section>
          {/* Creators section */}
          <div>
            <p className="font-[400] text-[32px] leading-none text-white w-[40%]">
              This event is for current or aspiring content creators in Nepal.
              Apply to join if you are a:
            </p>
            {Creators.map((items) => (
              <div key={items.id} className="">
                <div className="text-[#65E8BF] ">
                  <div className="bg-transparent p-4 flex gap-[47px]">
                    <h1 className="text-[44px] font-[700]">{items.id}</h1>
                    <span className="text-[124px] font-[700]">
                      {items.Creators}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-[#FF1C8B] via-[#F05A2A] to-[#65E3C3] h-[1px]"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h1>Frequently Asked Questions</h1>
          <FAQ />
        </section>
      </div>
      <FooterBottom />
    </div>
  );
};

export default HomePage;
