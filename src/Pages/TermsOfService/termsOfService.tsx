// import React from "react";
// import TopNav from "../../Components/Navbar/TopNav";
// import BGImage from "../../assets/Images/BackgroundImage.jpg";
// import FooterBottom from "../../Components/Footer/FooterBottom";

const TermsOfService = () => {
  const terms = [
    {
      title: "Use of Services",
      sections: [
        "Eligibility: You must be at least 16 years old to register for the event.",
        "Account Registration: You may be required to register an account to access certain features of our services. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
        "Prohibited Activities: You are prohibited from using our services to engage in illegal activities, infringe upon others' rights, or disrupt the services in any way.",
      ],
    },
    {
      title: "Content",
      sections: [
        "User-Generated Content: You may be able to submit content such as photos, bios, and comments. You retain all rights to your content, but you grant us a non-exclusive license to use, reproduce, and distribute your content in connection with the services.",
        "Responsibility for Content: You are solely responsible for the content you provide and the consequences of posting or publishing it.",
      ],
    },
    {
      title: "Intellectual Property",
      sections: [
        "Ownership of Services: The services and all rights therein, except for user-generated content, are owned by Techco Lab Pvt. Ltd. and the U.S. Embassy.",
        "Use of Material: You may not duplicate, copy, or reuse any portion of the HTML, CSS, JavaScript, or visual design elements or concepts without express written permission from us.",
      ],
    },
    {
      title: "Privacy and Data Use",
      sections: [
        "Data Handling: For information about our data practices, please review our Privacy Policy, which explains how we collect, use, and share your personal data.",
        "Consent to Data Use: By using our services, you agree that we can use your information in accordance with our Privacy Policy.",
      ],
    },
    {
      title: "Termination",
      sections: [
        "By User: You may terminate your use of the services at any time by closing your account.",
        "By Us: We may terminate or suspend your access to the services at any time, without prior notice or liability, if you breach any of the terms of these Terms.",
      ],
    },
    {
      title: "Disclaimers and Limitations of Liability",
      sections: [
        'Services Provided "As Is": The services are provided "as is" and "as available" without warranties of any kind, either express or implied.',
        "Limitation of Liability: Neither Techco Lab Pvt. Ltd. nor the U.S. Embassy will be responsible for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the services.",
      ],
    },
    {
      title: "Changes to Terms",
      sections: [
        "We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our site. Your continued use of the services after any changes come into effect constitutes your acceptance of the new Terms.",
      ],
    },
    {
      title: "Governing Law",
      sections: [
        "These Terms will be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.",
      ],
    },
    {
      title: "Contact Us",
      sections: [
        "If you have any questions about these Terms, please contact us at:info@usembassynepal.events",
      ],
    },
  ];

  return (
    <div className="px-[32px]">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[50%] pb-[32px]">
          <h1 className="text-[#65E8BF] font-[400] text-[35px] md:text-[64px]">
            Terms of Service
          </h1>
        </div>
        <div className="md:w-[50%]">
          <p className="text-[18px] md:text-[24px] font-[700] text-white leading-none pb-5">
            Welcome to the Creator's Mela! These Terms of Service ("Terms")
            govern your use of the Creator's Mela website and mobile app,
            managed by Techco Lab Pvt. Ltd. on behalf of the U.S. Embassy in
            Nepal. By accessing or using our services, you agree to be bound by
            these Terms. If you do not agree to these Terms, please do not use
            our services.
          </p>
          {terms.map((items, index) => (
            <div key={index}>
              <h1 className="text-[#65E8BF] text-[24px] font-[700] pb-5">
                {index + 1}. {items.title}
              </h1>
              <ul className="pl-5">
                {items.sections.map((section, index1) => (
                  <li
                    key={index1}
                    className="text-white text-[18px] md:text-[24px] font-[700] leading-none  pb-5 list-disc"
                  >
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
