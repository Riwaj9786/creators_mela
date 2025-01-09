import Animation from "../../assets/Images/Animation.gif";
import ContactUsForm from "../../Components/ContactUsForm/ContactUsForm";

const ContactUs = () => {
  return (
    <div>
      <section className="bg-transparent flex justify-around lg:justify-center pb-[108px] pr-[80px] ">
        <div className=" overflow-hidden rounded-md hidden lg:block max-w-[876px] max-h-[829px]">
          <img src={Animation} alt="" className="w-full h-full object-cover " />
        </div>
        <div className="">
          <ContactUsForm />
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
