import PerformerCard from "../../Components/ArtistCard/PerformerPageCard";

const PerformersPanel = () => {
  return (
    <div className="mx-20">
      <section>
        <h1 className="text-white text-[48px] font-[400] py-[40px] ">
          Performers
        </h1>
        <PerformerCard />
      </section>
    </div>
  );
};

export default PerformersPanel;
