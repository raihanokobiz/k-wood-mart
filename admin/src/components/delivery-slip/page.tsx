// "use client";

// import { POSItem } from "@/app/(admin-panel)/pos/item-selector";
// import React from "react";
// import logo from "@/assets/images/Bizpos-LOGO-BLACK.png";
// import Image from "next/image";
// import { Branches, Settings } from "@/types/shared";
// import { getSetting } from "@/services/settings";
// import { fileUrlGenerator } from "@/utils/helpers";
// import { BRAND_NAME } from "@/config/config";

// interface DeliverySlipProps {
//   orderData: {
//     orderId: string;
//     customerName: string;
//     customerPhone: string;
//     customerAddress: string;
//     date: string;
//   };
//   items: POSItem[];
//   totalQty: number;
//   cod: number;
//   existingBranch: Branches;
// }

// const DeliverySlip = React.forwardRef<HTMLDivElement, DeliverySlipProps>(
//   ({ orderData, items, totalQty, cod, existingBranch }, ref) => {
//     const [settingsData, setSettingsData] = React.useState<Settings>();

//     React.useEffect(() => {
//       getSetting().then((data) => setSettingsData(data));
//     }, []);

//     return (
//       <div ref={ref} className="w-[4in] h-[6in] mx-auto flex flex-col text-xs">
//         <div className="m-1 border border-black flex flex-col flex-grow">
//           <div className="flex justify-between items-center border-b border-gray-700 divide-x divide-gray-700">
//             <div className="w-1/4 p-2">
//               {/* {settingsData?.logo_image_url ? (
//                 <Image
//                   src={fileUrlGenerator(settingsData.logo_image_url)}
//                   alt="Bizpos Logo"
//                   height={40}
//                   width={150}
//                   className="w-full h-full object-fit"
//                 />
//               ) : (
//                 <p className="w-full flex justify-center items-center text-3xl font-bold">
//                   {BRAND_NAME}
//                 </p>
//               )} */}
//               <img
//                 src="/Bizpos-LOGO-BLACK.png"
//                 alt="Bizpos Logo"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="text-sm p-1 w-3/4">
//               <p>
//                 {existingBranch.address}
//                 {"         "}
//                 Ph: {existingBranch.phone}
//               </p>
//             </div>
//           </div>

//           <div className="p-1 border-b border-gray-700">
//             <div className="flex items-center justify-between pb-2">
//               <p className="font-bold">{orderData.customerName}</p>
//               <p className="font-bold">{orderData.customerPhone}</p>
//             </div>
//             <p>{orderData.customerAddress}</p>
//           </div>

//           <div className="p-1 flex-grow overflow-auto">
//             {items.map((item, index) => (
//               <p
//                 key={index}
//               >{`${item.barcode}-${item.name}-${item.colorName}-${item.sizeName}`}</p>
//             ))}
//           </div>

//           <div className="flex justify-between border-y divide-x divide-gray-700 border-gray-700">
//             {/* <div>Date: {orderData.date}</div> */}
//             <div className="pl-1 py-2 w-1/3">
//               <p>Order ID:</p>
//               <h1 className="font-semibold">{orderData.orderId}</h1>
//             </div>
//             <div className="pl-1 py-2 w-1/3">
//               <p>Item Quantity:</p>
//               <h1 className="font-semibold">{totalQty}</h1>
//             </div>
//             <div className="pl-1 py-2 w-1/3">
//               <p>COD: BDT</p>
//               <h1 className="font-semibold">{cod.toFixed(2)}</h1>
//             </div>
//           </div>

//           <div className="p-1 text-sm">
//             <p>
//               <span className="font-semibold">Return & Exchange:</span>{" "}
//               {/* {settingsData?.return_privacy_policy || ""} */}
//               <span
//                 dangerouslySetInnerHTML={{
//                   __html: String(settingsData?.return_privacy_policy),
//                 }}
//               />
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// DeliverySlip.displayName = "DeliverySlip";

// export default DeliverySlip;
