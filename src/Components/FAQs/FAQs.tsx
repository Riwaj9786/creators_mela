import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faqSelector, fetchFAQs } from "../../app/features/faqSlice";
import Uparrow from "../../assets/Icons/UpArrow.svg";
import Downarrow from "../../assets/Icons/DownArrow.svg";
import { AppDispatch } from "../../app/store";
import { useLocation } from "react-router-dom";

const FAQ = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { faqs, status, error } = useSelector(faqSelector);

  const homePageFaq = faqs.slice(0, 5);

  const [selected, setSelected] = useState(null);
  // console.log(faqs.length,faqs, "length");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFAQs());
    }
  }, [dispatch, status]);

  const toggleDropdown = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  if (status === "loading") {
    return <p className="text-white">Loading FAQs...</p>;
  }

  if (status === "failed") {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <ul className="faq-container">
      {(faqs?.length > 0 && pathname === "/" ? homePageFaq : faqs)?.map(
        (item, index) => (
          <li key={index} className="flex flex-col gap-[40px] border-b border-[#BBBAD2] ">
            <div
              onClick={() => toggleDropdown(index)}
              className=" flex justify-between pt-[46px] pb-[20px]"
            >
              <span className="cursor-pointer text-[#AFFDE4] text-[34px] font-[500] leading-none">
                {item.question}
              </span>

              <button className="cursor-pointer">
                {selected === index ? (
                  <img src={Uparrow} alt="Collapse FAQ" />
                ) : (
                  <img src={Downarrow} alt="Expand FAQ" />
                )}
              </button>
            </div>
            {selected === index && (
              <div className="text-[#BDDFD2] text-[24px] font-[500] leading-none">
                {item.answer}
              </div>
            )}
          </li>
        )
      )}
    </ul>
  );
};

export default FAQ;
