import LeftSectionImage from "../../assets/Images/AboutUsImage.png";

const AboutUs = () => {
  return (
    <div className="flex  flex-col md:flex-row w-full px-[32px] pt-[50px] h-full">
      <section className="flex  h-full md:w-1/3 ">
        
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row ">
            <img
              src={LeftSectionImage}
              alt=""
              className=" top-[155px] left-0 h-[227.86px]  "
            />
            <h1 className="text-[#65E8BF] text-[64px] font-[400] top-[107px] left-[230px]  leading-none ">
              About Creator's <span className="text-[40px] md:text-[60px]">मेला</span>
            </h1>
        </div>
      </section>
      <section className=" pb-[140px] flex justify-end md:justify-center md:w-2/3">
        <p className="leading-none text-white font-[500] text-[24px] md:px-[48px]  max-w-[907px]">
          Creator’s Mela is a digital conference designed to sharpen and develop
          the skills of current and aspiring Nepali digital creators and
          influencers, and to launch and grow their online presence or
          businesses. Last year, we had over 1,500 content creators join the
          first-of-its-kind in-person event to network, experience the music
          festival-inspired main stage and immersive creator zone, and to
          level-up their skills through the 17 interactive sessions on topics
          like brand-building, financial literacy, and content development!
          <br />
          <br />
          We also had well-established content creators from the United States
          and Nepal join our line-up. This year, Creator’s Mela 2024: Build,
          Brand, Boost will take place from July 25-27 and set out to empower
          even more creators and help them develop their technical and business
          skills, their brand, and learn about the set-ups and production
          processes of their favorite content creators. We will kick-off with a
          reception on the evening of July 25 and then host two days of
          high-energy main stage performances and high-value workshops exploring
          topics like artificial intelligence, monetization, security, privacy,
          and mental health and welcome the content creator community to hear
          from and interact with government officials about laws and regulations
          impacting content creators. We also plan to have representatives from
          various social media platforms in attendance at the Mela, leading
          sessions and hosting booths at the event.
          <br />
          <br />
          Creator’s Mela is a unique opportunity for you to connect with a
          young, thriving, ambitious community of content creators in Nepal who
          see content creation as an outlet for free expression, education,
          representation, business, and success.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
