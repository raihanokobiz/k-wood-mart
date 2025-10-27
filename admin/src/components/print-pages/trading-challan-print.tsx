// "use client";

// import React, { useEffect, useState } from "react";
// import { OrderWithItem, POSItem } from "@/app/(admin-panel)/pos/item-selector";
// import logo from "@/assets/images/Bizpos-LOGO-BLACK.png";
// import Image from "next/image";
// import {
//   Branches,
//   Orders,
//   SalesData,
//   Settings,
//   TradingItems,
//   Tradings,
//   TradingWithItem,
// } from "@/types/shared";
// import { TotalsOfOrder } from "@/app/(admin-panel)/orders/orders-list/dropdown";
// import { getSetting } from "@/services/settings";
// import { fileUrlGenerator } from "@/utils/helpers";
// import { BRAND_NAME } from "@/config/config";
// import { formatDate } from "date-fns";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Ubuntu } from "next/font/google";

// export const ubuntu = Ubuntu({
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
// });

// interface PrintChallanProps {
//   orderData: TradingWithItem[];
//   order: Tradings;
//   existingBranch: Branches;
//   totals?: TotalsOfOrder[] | undefined;
//   // settingsData: Settings;
// }

// const PrintTradingChallan = React.forwardRef<HTMLDivElement, PrintChallanProps>(
//   ({ orderData, order, existingBranch, totals }, ref) => {
//     return (
//       <div ref={ref} className="w-[8in] h-screen mx-auto text-sm flex flex-col">
//         <div className="m-1 px-8 py-4 flex flex-col flex-grow font-semibold">
//           <div className="flex justify-between items-center">
//             <div className="w-1/4 p-2">
//               <img
//                 src="/images/maclink-logo-140x80px.png"
//                 alt="Bizpos Logo"
//                 className="h-full object-cover"
//               />
//             </div>

//             <div className="p-1 w-3/4">
//               <p className={`${ubuntu.className} text-2xl font-bold`}>
//                 MACLINK INTERNATIONAL
//               </p>
//               <p>{existingBranch.address}</p>
//               <p className="">
//                 <span className="font-semibold">Hotline:</span>{" "}
//                 {existingBranch.phone}, 01929813331
//               </p>
//             </div>
//           </div>
//           <h1 className="text-center text-xl font-semibold underline">
//             CHALLAN
//           </h1>

//           <div className="p-1 grid grid-cols-3 gap-4">
//             <div className="col-span-2 text-sm flex items-start justify-start gap-3">
//               <p>To:</p>

//               <div className="font-bold">
//                 <p className="py-1 w-full">{order.customer}</p>
//                 <p className="py-1 w-full">{order.phone}</p>
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: String(order.address),
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="col-span-1 text-sm">
//               <p>
//                 No.: <span className="py-1 w-full">{order.order_id}</span>
//               </p>
//               <p>
//                 Date:{" "}
//                 {order?.date && (
//                   <span>{formatDate(order.date, "dd/MM/yyyy")}</span>
//                   // <span className="border-b border-b-black py-1 w-full">
//                   //   {String(order.date)}
//                   // </span>
//                 )}{" "}
//               </p>
//             </div>
//           </div>

//           <div className="mt-10 p-1 flex-grow overflow-auto">
//             <Table className="min-w-full min-h-full table">
//               <TableHeader>
//                 <TableRow className="bg-gray-100">
//                   <TableHead className="h-8  text-left px-2">Sl. No.</TableHead>
//                   <TableHead className="h-8  text-left px-2">Item</TableHead>
//                   <TableHead className="h-8  text-left px-2">Model</TableHead>
//                   <TableHead className="h-8  text-left px-2">Brand</TableHead>
//                   <TableHead className="h-8  text-left px-2">
//                     Quantity
//                   </TableHead>
//                   <TableHead className="h-8  text-left px-2">Remarks</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody className="flex-grow">
//                 {orderData?.map((orderItem, index) =>
//                   orderItem.items.map((item, subIndex) => (
//                     <TableRow key={index} className="">
//                       <TableCell className="py-2 px-2 ">
//                         {subIndex + 1}
//                       </TableCell>
//                       <TableCell className="py-2 px-2 ">{item.name}</TableCell>
//                       <TableCell className="py-2 px-2  text-center">
//                         {item.model === undefined ? "" : item.model}
//                       </TableCell>
//                       <TableCell className="py-2 px-2  text-center">
//                         {item.brand === undefined ? "" : item.brand}
//                       </TableCell>
//                       <TableCell className="py-2 px-2  text-center">
//                         {item.quantity}
//                       </TableCell>
//                       <TableCell className="py-2 px-2 "></TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>

//               <TableFooter>
//                 <TableRow className="bg-gray-200 font-semibold">
//                   <TableCell className="py-2 px-2  text-left" colSpan={4}>
//                     Total
//                   </TableCell>
//                   <TableCell className="py-2 px-2  text-center">
//                     {orderData?.reduce(
//                       (total, orderItem) =>
//                         total +
//                         orderItem.items.reduce(
//                           (subTotal, item) => subTotal + Number(item.quantity),
//                           0
//                         ),
//                       0
//                     )}
//                   </TableCell>
//                   <TableCell className="py-2 px-2 "></TableCell>
//                 </TableRow>
//               </TableFooter>
//             </Table>
//           </div>

//           {/* <div className="absolute -rotate-90 top-0 left-0 text-6xl">
//             CHALLAN
//           </div> */}

//           <div className="flex flex-row-reverse justify-between items-end p-10">
//             <div>
//               <p className="px-4 py-2 border-t border-t-black border-dashed">
//                 Received By
//               </p>
//             </div>
//             <div>
//               <p className="px-4 py-2 border-t border-t-black border-dashed">
//                 Authorized Signature
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// PrintTradingChallan.displayName = "PrintTradingChallan";

// export default PrintTradingChallan;
