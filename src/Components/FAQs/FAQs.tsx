// import React from 'react'
import AboutHCGUP from "../../assets/Icons/Vector (1).png";
import AboutHCGDOWN from "../../assets/Icons/Vector (2).png";
import { faqs } from "../../assets/ComponentsData/FAQsData";

import { useState } from "react";

const FAQ = () => {
  const [dropDown, setDropDown] = useState(false);
  const [selected, setSelected] = useState(null);

  // console.log("value", dropDown, selected);
  const changeState = (id) => {
    setDropDown(!dropDown);
    setSelected(id);
  };

  const FAQs = faqs;

  return (
    <>
      <div className="px-[28px]">
        {FAQs.map((items, index) => (
          <ul key={index} className="flex flex-col">
            <li className="border-t border-[#0C4E47] text-[#0C4E47] h-[73px] flex items-center justify-between font-bold text-[16px]">
              <span
                onClick={() => changeState(index)}
                className="cursor-pointer"
              >
                {items.question}
              </span>

              <button
                className="cursor-pointer "
                onClick={() => changeState(index)}
              >
                {dropDown && selected === index ? (
                  <img src={AboutHCGUP} alt="" />
                ) : (
                  <img src={AboutHCGDOWN} alt="" />
                )}
              </button>
            </li>
            {dropDown && selected === index ? (
              <li className="border-t border-[#0C4E47] text-[#0C4E47] h-[73px] flex items-center">
                {items.answer}
              </li>
            ) : (
              ""
            )}
          </ul>
        ))}
      </div>
    </>
  );
};

export default FAQ;
