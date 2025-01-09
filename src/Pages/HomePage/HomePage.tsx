import Apply from "../../Components/HomePageComponents/Apply";
import Animation from "../../assets/Images/Animation.gif";
import SECBG from "../../assets/Images/section-2-bg.png";
import Circle from "../../assets/Images/Circle.svg";
import ArtistCard from "../../Components/ArtistCard/ArtistCard";
import FAQ from "../../Components/FAQs/FAQs";
import { ContentCreators } from "../../assets/ComponentsData/ContentCreator";
import Marquee from "react-fast-marquee";
import Banner from "../../assets/Icons/Banner.svg";
import { Link } from "react-router-dom";

const HomePage = () => {
  const Creators = ContentCreators;

  const textContent = ["Aloft Hotel, Kathmandu", "July 26 & 27, 2024"];
  const bannerImages = [Banner, Banner];

  return (
    <div>
      <div className="relative lg:flex justify-end hidden ">
        <div className="absolute top-[149px] ">
          <img src={Circle} alt="" />
        </div>
      </div>
      <section className="bg-transparent flex justify-around lg:justify-center px-[17px] container">
        <div className=" overflow-hidden rounded-md">
          <img
            src={Animation}
            alt=""
            className="w-[300px] h-[300px] md:w-[473px] md:h-[481px] lg:w-full lg:h-full object-cover "
          />
        </div>
        <div className="hidden lg:block min-w-[500px] z-20 ">
          <Apply />
        </div>
      </section>

      <section className="overflow-hidden h-[200px] md:h-[300px] pt-[60px] ">
        <div className="-rotate-6 w-[150%] -mx-10">
          <Marquee speed={100} className="bg-[#E8483F]">
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
      </section>

      <section className="bg-transparent flex md:justify-around justify-center items-center  md:ml-[130px] md:mr-[130px] px-[20px] pt-[12px]">
        <div className="flex flex-col  px-[9px]">
          <h1 className="font-[700] text-[30px] lg:text-[84px] leading-none text-[#F4C4D1] w-[299px] md:w-full max-w-[1150px]">
            WHAT IS CREATOR'S MELA?
          </h1>
          <p className="font-[700] text-[16px] md:text-[40px] leading-none text-[#FFFFFF] max-w-[1150px] lg:pt-[64px] pt-[12px]">
            Creator’s Mela is a digital conference designed to sharpen and
            develop the skills of current and aspiring Nepali digital creators
            and influencers, and to launch and grow their online presence or
            businesses. Last year, we had over 1,500 content creators join the
            first-of-its-kind in-person event to network, experience the music
            festival-inspired main stage and immersive creator zone, and to
            level-up their skills through the 17 interactive sessions on topics
            like brand-building, financial literacy, and content development!
          </p>
          <Link
            to="/AboutUs"
            className="pt-[12px] lg:pt-[134px] pb-[66px] flex justify-center"
          >
            <button className="text-white bg-[#CC065B] rounded-[84px] w-[221px] h-[51px] lg:h-[80px] lg:w-[269px] ">
              Learn More
            </button>
          </Link>
        </div>
      </section>
      <section className="h-full  flex flex-wrap pb-[60px]">
        <div className="relative h-[244px] md:h-[825px]">
          <div className="flex justify-center">
            <div className=" absolute   md:w-full  h-[244px] md:h-[825px] top-0  md:flex md:justify-center">
              <img
                src={SECBG}
                alt=""
                className=" w-[263px] md:max-w-[600px] lg:w-full h-full "
              />
            </div>
          </div>

          <div className=" text-white p-6 flex flex-col h-full container">
            <div className="z-10 md:flex md:flex-row">
              <h1 className="text-[32px] md:text-[104px] leading-none font-[700] lg:pt-[10%] max-w-[679px] ">
                How to be part of Creator’s Mela 2024
              </h1>
              <ol className="grid grid-cols-2 pt-[30px] md:block">
                <li className="">
                  <span className=" text-[#E8483F] text-[32px] md:text-[80px]">
                    1.
                  </span>
                  <span className="font-[500] text-[20px] md:text-[32px]">
                    Apply to join at usembassy nepal.events
                  </span>
                </li>
                <li>
                  <span className=" text-[#E8483F] text-[32px] md:text-[80px]">
                    2.
                  </span>
                  <span className="font-[500] text-[20px] md:text-[32px]">
                    Onceselected, download the "Creator’s Mela" apps.
                  </span>
                </li>
                <li>
                  <span className=" text-[#E8483F] text-[32px] md:text-[80px]">
                    3.
                  </span>
                  <span className="font-[500] text-[20px] md:text-[32px]">
                    Choose your preferred session.
                  </span>
                </li>
                <li>
                  <span className=" text-[#E8483F] text-[32px] md:text-[80px]">
                    4.
                  </span>
                  <span className="font-[500] text-[20px] md:text-[32px]">
                    Attend Creator’s Mela 2024!
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="container mt-[90px] md:mt-[50px] md:pt-[100px]">
        {/* Performers section */}
        <div className="flex flex-col justify-center md:block">
          <h1 className="text-[#F4C4D1] text-[32px] md:text-[84px] font-[700]">
            Performers
          </h1>
          <ArtistCard userType="performers" />
        </div>
      </section>
      <section className="container">
        {/* Speakers section */}
        <div className="flex flex-col justify-center md:block">
          <h1 className="text-[#F4C4D1] text-[32px] md:text-[84px] font-[700]">
            Speakers
          </h1>
          <ArtistCard userType="speakers" />
        </div>
      </section>
      <section className="pt-[97px] container">
        {/* Creators section */}
        <div>
          <p className="font-[400] md:text-[32px] sm:text-[28px] text-[16px] leading-none text-white  sm:w-[500px] md:w-[780px]">
            This event is for current or aspiring content creators in Nepal.
            Apply to join if you are a:
          </p>
          {Creators.map((items) => (
            <div key={items.id} className="">
              <div className="text-[#65E8BF] ">
                <div className="bg-transparent p-4 flex gap-[47px]">
                  <h1 className="text-[11px] font-[700] md:text-[20px]  lg:text-[44px] ">
                    {items.id}
                  </h1>
                  <span className="text-[32px] md:text-[80px] lg:text-[124px]  font-[700]">
                    {items.Creators}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-[#FF1C8B] via-[#F05A2A] to-[#65E3C3] h-[1px]"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className=" pt-[97px] container">
        <div className="">
          <h1 className="text-white text-[34px]  md:text-[64px] font-[400] leading-none">
            Frequently Asked Questions
          </h1>
          <FAQ />

          <Link to="/help" className="flex justify-end pt-[56px]">
            <button
              className="relative px-0.5 py-0.5 text-[32px] font-medium leading-[38.4px] w-fit rounded-[100px] "
              style={{
                background: "linear-gradient(150deg, #FF1C8B, #F05A2A,#65E3C3)",
              }}
            >
              <div className="bg-[#21205C] px-8 py-3 rounded-[100px]">
                <span className="gradient-text text-[20px] md:text-[32px] md:leading-[38.4px] md:px-0">
                  See More
                </span>
              </div>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
