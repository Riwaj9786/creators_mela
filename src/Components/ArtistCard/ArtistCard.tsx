import React, { useState, useEffect } from "react";
import Profile1 from "../../assets/Images/Performer-1.jpeg";
import Profile2 from "../../assets/Images/Performer-2.jpg";
import Profile3 from "../../assets/Images/Performer-3.png";
import Profile4 from "../../assets/Images/Performer-4.png";

const ArtistCard = () => {
  const performers: {
    id: number;
    name: string;
    igId: string;
    image: string;
  }[] = [
    { id: 1, name: "User 1", igId: "@user1", image: Profile1 },
    { id: 2, name: "User 2", igId: "@user2", image: Profile2 },
    { id: 3, name: "User 3", igId: "@user3", image: Profile3 },
    { id: 4, name: "User 4", igId: "@user4", image: Profile4 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % performers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? performers.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(handleNext, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <>
      <div
        className="relative grid grid-cols-3 gap-4 rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {performers
          .concat(performers)
          .slice(currentIndex, currentIndex + 3)
          .map((artist) => (
            <div
              key={artist.id}
              className="relative rounded-[104px] overflow-hidden group h-[676px] w-[562px]"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-[#65E8BF] text-[#110D2F] text-center p-2 transform translate-y-full group-hover:translate-y-0 transition duration-300 ease-in-out">
                <h2 className="font-bold text-lg">{artist.name}</h2>
                <p className="text-sm">{artist.igId}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-center w-full gap-[32px] pt-[64px]">
        <button
          className="bg-[#CC065B] text-white px-4 py-2 rounded border-[1.5px] border-white"
          onClick={handlePrev}
        >
          {"<"}
        </button>
        <button
          className="bg-[#CC065B] text-white px-4 py-2 rounded border-[1.5px] border-white"
          onClick={handleNext}
        >
          {">"}
        </button>
      </div>
    </>
  );
};

export default ArtistCard;
