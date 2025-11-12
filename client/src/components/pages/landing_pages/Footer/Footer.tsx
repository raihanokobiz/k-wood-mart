"use Client";

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  // FaRegCreditCard,
  // FaTruck,
  FaYoutube,
} from "react-icons/fa";
// import { FaRegMessage, FaRightLeft } from "react-icons/fa6";
import Link from "next/link";
import DownFooter from "../../DownFooter/DownFooter";

interface FooterProps {
  userCartProducts: {
    cartDetails: any[]; // Replace 'any' with the specific type if known
  };
}

const Footer: React.FC<FooterProps> = ({ userCartProducts }) => {
  const quickLink = [
    {
      name: "Shop",
      link: "/shop",
    },
    {
      name: "About Us",
      link: "/about",
    },
    {
      name: "Blogs",
      link: "/blogs",
    },
    {
      name: "Contact Us",
      link: "/contact",
    },
  ];

  const information = [
    {
      name: "Order Policy",
      link: "/orderPolicy",
    },
    {
      name: "Privacy Policy",
      link: "/privacyPolicy",
    },
    {
      name: "Return Policy",
      link: "/returnPolicy",
    },
    {
      name: "Terms & Condition",
      link: "/terms-condition",
    },
  ];

  return (
    <div className="relative bg-gray-100">
      <div className="py-4 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between space-y-5">
          <div>
            <div className="text-black font-semibold mb-[20px] text-xl">
              Contact Info
            </div>
            <div className="text-black text-md lg:text-lg flex flex-col space-y-1">
              <div>Contact: 01712044438</div>
              <div>Whats app: 01972044438</div>
              <div>
                Address: সাঁতারকুল রোড, পশ্চিম পদরদিয়া, লেন নাম্বার ৪,
                <br />
                বাইতুল মামুর মসজিদ রোড, বাড়ি নম্বর ৬০, <br />
                বাড্ডা ঢাকা- ২৯৪১. <br />
                OFFICE ADD RD-122,H 37 GULSHAN-1 DHAKA 1212
              </div>
            </div>
          </div>
          <div>
            <div className="text-black font-semibold mb-[20px] text-xl">
              Quick Links
            </div>
            <ul className="text-black text-xl">
              {quickLink.map((item, index) => (
                <div key={index}>
                  <Link href={item.link}>
                    <li className="my-1 relative group cursor-pointer">
                      <span className="inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:text-black text-md lg:text-lg">
                        {item.name}
                      </span>
                    </li>
                  </Link>
                </div>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-black font-semibold mb-[20px] text-xl">
              Infromation
            </div>
            <ul className="text-black text-xl">
              {information.map((item, index) => (
                <div key={index}>
                  <Link href={item.link}>
                    <li className="my-1 relative group cursor-pointer">
                      <span className="inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:text-black text-md lg:text-lg">
                        {item.name}
                      </span>
                    </li>
                  </Link>
                </div>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-black font-semibold mb-[20px] text-xl">
              Social Media
            </div>
            <div className="">
              <div className="flex lg:justify-center lg:items-center gap-2 mt-4">
                <a
                  href="https://www.facebook.com/people/K Wood Mart/61574046337876/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-[#2563EB] rounded text-[#fff] border border-[#fff]/0 hover:scale-95 hover:border-[#fff] hover:border duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded text-[#fff] border border-[#fff]/0 hover:scale-95 hover:border-[#fff] hover:border duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>

                {/* <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded text-white border border-white/0 hover:scale-95 hover:border-white hover:border duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a> */}

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-[#F60000] rounded text-[#fff] border border-[#fff]/0 hover:scale-95 hover:border-[#fff] hover:border duration-300"
                  aria-label="youtube"
                >
                  <FaYoutube />
                </a>
              </div>

              {/* <div className="mt-2">
                <iframe
                  title="K Wood Mart Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.887678301881!2d90.35840537590783!3d23.751612289096654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0a0f9dbecab%3A0x1a5d5cce63cc8693!2sFabrilife!5e0!3m2!1sen!2sbd!4v1712391482365!5m2!1sen!2sbd"
                  width="500vh"
                  height="160vh"
                  className="rounded-md border border-gray-300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="  text-center py-4 border-t">
        Copyright © 2025 K.WOOD MART All Right Reserved. Developed by{" "}
        <a target="_blank" href="https://okobiz.com/">
          okobiz
        </a>
        .
      </div>

      <DownFooter userCartProducts={userCartProducts} />
    </div>
  );
};
export default Footer;
