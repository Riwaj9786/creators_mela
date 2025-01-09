import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_URL;

const ArtistCard = ({ userType }) => {
  const [performers, setPerformers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardNumber, setCardNumber] = useState(3);

  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/people/${userType}/`);
        setPerformers(response.data.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPerformers();
  }, []);

  // console.log(performers, "performers");

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % performers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? performers.length - 1 : prev - 1));
  };

  const updateVisibleCards = () => {
    const width = window.innerWidth;
    if (width < 768) setCardNumber(1);
    else if (width < 1400) setCardNumber(2);
    else setCardNumber(3);
  };

  useEffect(() => {
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(handleNext, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, performers]);

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[100]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {performers
          .slice(currentIndex, currentIndex + cardNumber)
          .map((artist, index) => (
            <div key={index} className="flex">
              <div className="relative rounded-[104px] overflow-hidden group h-[500px] w-[400px]">
                <img
                  src={artist.profile_picture}
                  alt={artist.user.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-[#65E8BF] text-[#110D2F] text-center p-2 transform translate-y-full group-hover:translate-y-0 transition duration-300 ease-in-out">
                  <h2 className="font-bold text-lg">{artist.user.name}</h2>
                  <p className="text-sm">{artist.social_media.url}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-center w-full gap-8 pt-16">
        <button
          className="bg-[#CC065B] text-white px-4 py-2 rounded border-[1.5px] border-white"
          onClick={handlePrev}
          aria-label="Previous"
        >
          {"<"}
        </button>
        <button
          className="bg-[#CC065B] text-white px-4 py-2 rounded border-[1.5px] border-white"
          onClick={handleNext}
          aria-label="Next"
        >
          {">"}
        </button>
      </div>
    </>
  );
};

export default ArtistCard;
