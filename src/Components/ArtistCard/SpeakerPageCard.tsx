import { useEffect, useState } from "react";
import axios from "axios";

const SpeakerCard = ({ Is_International }) => {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/people/speakers/`);
        // console.log(response.data, "responae");
        const { results } = response.data;
        const filterData = results.filter(
          (artist) => artist.is_international === Is_International
        );
        setPerformers(filterData);
        // console.log(results, "results");
      } catch (error) {
        console.error("Error fetching performers:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log(Is_International, "performers");
    fetchPerformers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="relative grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-[60px] gap-[55px] place-items-center">
        {performers.map((artist, index) => (
          <div
            key={index}
            className="relative rounded-[104px] overflow-hidden group w-[430px] h-[517px]"
          >
            <img
              src={artist.profile_picture || "default-image-url.jpg"}
              alt={artist.user.name || "Unnamed Speaker"}
              className="object-cover h-full w-full"
            />
            <div className="absolute bottom-0 left-0 w-full bg-[#65E8BF] text-[#110D2F] text-center p-2 transform translate-y-full group-hover:translate-y-0 transition duration-300 ease-in-out">
              <h2 className="font-bold text-lg">
                {artist.user.name || "Unknown Name"}
              </h2>
              <p className="text-sm">
                {artist.social_media?.map((item, index) => (
                  <span key={index} className="flex flex-col">
                    {item.url}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full gap-[32px] pt-[64px]"></div>
    </div>
  );
};

export default SpeakerCard;
