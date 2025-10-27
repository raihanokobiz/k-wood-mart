// "use client";

// import { apiBaseUrl } from "@/config/config";
// import { TBanner } from "@/types";
// import Image from "next/image";
// import React, { useState } from "react";
// import { MdDoubleArrow } from "react-icons/md";

// interface BannerProps {
//   banners: TBanner[];
// }
// const UpcomingSideBanner: React.FC<BannerProps> = ({ banners }) => {
//   const { open, setIsOpen } = useState(true);
//   const upcomingBanner = banners?.filter(
//     (banner) => banner.type === "UPCOMING BANNER"
//   );


//   return (
//     <div>
//       <div className="w-[50vh] bg-[#fff] fixed top-0 right-0 min-h-screen z-[999] border-l border-[#262626] shadow ">
//         <h2 className="text-center mt-8 text-xl font-semibold capitalize">
//           Upcoming products
//         </h2>

//         <div className="w-[30px] h-[30px] border bg-[#1F4095] cursor-pointer text-[#fff] rounded flex items-center justify-center absolute left-[-40px] mt-8 z-[99]">
//           <MdDoubleArrow />
//         </div>

//         <div className="flex flex-col gap-4 items-center justify-between mt-8">
//           {upcomingBanner?.map((banner) => (
//             <div key={banner._id}>
//               <div className="border border-[#262626]/40 p-2 rounded">
//                 <Image
//                   src={apiBaseUrl + banner.image}
//                   width={400}
//                   height={200}
//                   alt="demo"
//                   className="rounded"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpcomingSideBanner;

"use client";

import { apiBaseUrl } from "@/config/config";
import { TBanner } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdDoubleArrow } from "react-icons/md";

interface BannerProps {
  banners: TBanner[];
}

const UpcomingSideBanner: React.FC<BannerProps> = ({ banners }) => {
  const [isOpen, setIsOpen] = useState(false);

  const upcomingBanner = banners?.filter(
    (banner) => banner.type === "UPCOMING BANNER"
  );

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => {
      setIsOpen(true);
    }, 100); // Slight delay for smooth slide-in
  }, []);

  return (
    <div>
      <div
        className={`transition-all duration-500 fixed top-0 right-0 z-50 h-screen bg-white border-l border-[#262626] shadow   md:w-[50vh] w-[40vh] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-center mt-8 text-xl font-semibold capitalize">
          Upcoming products
        </h2>

        {/* Toggle button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-[30px] h-[30px] border bg-[#1F4095] cursor-pointer text-[#fff] rounded flex items-center justify-center absolute left-[-35px] mt-8 z-[99] transition-transform duration-500 ${isOpen ? "rotate-0" : "rotate-180"
            }`}
        >
          <MdDoubleArrow />
        </div>

        {/* Banners */}
        <div className="flex flex-col gap-4 items-center justify-between mt-8 px-4">
          {upcomingBanner?.map((banner) => (
            <div key={banner._id}>
              <div className="border border-[#262626]/40 p-2 rounded">
                <Image
                  src={apiBaseUrl + banner.image}
                  width={400}
                  height={200}
                  alt="demo"
                  className="rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingSideBanner;
