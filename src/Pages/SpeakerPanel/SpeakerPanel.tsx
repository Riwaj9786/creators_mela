import SpeakerCard from "../../Components/ArtistCard/SpeakerPageCard";




const SpeakerPanel = () => {
  return (
    <div className="mx-20">
      <section>
        <h1 className="text-white text-[48px] font-[400] py-[40px] ">
          International Speakers
        </h1>
        <SpeakerCard Is_International={true} />
      </section>
      <section>
        <h1 className="text-white text-[48px] font-[400] py-[40px] ">
          Nepali Speakers
        </h1>
        <SpeakerCard Is_International={false} />
      </section>
    </div>
  );
};

export default SpeakerPanel;
