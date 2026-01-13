// "use client";

// import React from "react";
// import logo from "@/assets/images/Bizpos-LOGO-BLACK.png";
// import Image from "next/image";
// import { Branches, Settings } from "@/types/shared";
// import { POSItem } from "@/app/(admin-panel)/pos/item-selector";
// import { Label } from "@radix-ui/react-label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { fileUrlGenerator, makePrice } from "@/utils/helpers";
// import { getSetting } from "@/services/settings";
// import { BRAND_NAME } from "@/config/config";
// import { ubuntu } from "./challan-print";

// interface DamageProductSlipProps {
//   existingBranch: Branches;
//   damagedStocks: POSItem[];
// }

// const DamageProductSlip = React.forwardRef<
//   HTMLDivElement,
//   DamageProductSlipProps
// >(({ existingBranch, damagedStocks }, ref) => {
//   const [settingsData, setSettingsData] = React.useState<Settings>();

//   React.useEffect(() => {
//     getSetting().then((data) => setSettingsData(data));
//   }, []);

//   const totals = damagedStocks.reduce(
//     (acc: any, item) => {
//       acc.stockValue += Number(item.cost || 0);
//       acc.sellValue += Number(item.selling_price || 0);
//       acc.quantity += item.quantity || 0;
//       return acc;
//     },
//     { stockValue: 0, sellValue: 0, quantity: 0 }
//   );
//   return (
//     <div ref={ref} className="w-screen mx-auto p-6">
//       {/* Header Section */}
//       <div className="w-full border-b border-gray-700 p-2 flex items-center justify-between">
//         <div className="w-1/5">
//           {/* {logoUrl ? (
//                     <Image src={logoUrl} alt="Bizpos Logo" width={100} height={50} />
//                   ) : (
//                     <p className="w-full flex justify-start items-center text-3xl font-bold">
//                       {BRAND_NAME}
//                     </p>
//                   )} */}
//           <img
//             src="/images/maclink-logo-140x80px.png"
//             alt="Maclink Logo"
//             className="h-full object-cover"
//           />
//         </div>
//         <div className="w-2/5 text-start pl-4">
//           <p className={`${ubuntu.className} font-bold text-lg`}>
//             MACLINK INTERNATIONAL
//           </p>
//           {/* <p>{existingBranch.name}</p>
//                   <p>{existingBranch.address}</p>  */}
//         </div>
//         <div className="w-2/5 text-end">
//           <p className="text-xl font-semibold">Damaged Stocks</p>
//         </div>
//       </div>

//       <div className="py-4">
//         <Table className="rounded-lg overflow-hidden">
//           <TableHeader className="bg-primary">
//             <TableRow>
//               {/* <TableHead className="h-8 text-white">SL</TableHead> */}
//               {/* <TableHead className="h-8 text-white">Item Code</TableHead> */}
//               {/* <TableHead className="h-8 text-white">Barcode</TableHead> */}
//               <TableHead className="h-8 text-white">Product Name</TableHead>
//               <TableHead className="h-8 text-white">Category</TableHead>
//               <TableHead className="h-8 text-white">Model</TableHead>
//               <TableHead className="h-8 text-white">Brand</TableHead>
//               <TableHead className="h-8 text-white">Stock Value</TableHead>
//               <TableHead className="h-8 text-white">Sell Value</TableHead>
//               <TableHead className="h-8 text-white">Qty</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {damagedStocks.map((item, index) => (
//               <TableRow key={item.barcode}>
//                 {/* <TableCell className="py-2">{index + 1}</TableCell> */}
//                 {/* <TableCell className="py-2">{item.productId}</TableCell> */}
//                 {/* <TableCell className="py-2">{item.barcode}</TableCell> */}
//                 <TableCell className="py-2 w-60">{item.name}</TableCell>
//                 <TableCell className="py-2 w-60">{item.categoryName}</TableCell>
//                 <TableCell className="py-2 w-60">{item.brandName}</TableCell>
//                 <TableCell className="py-2 w-60">{item.sku}</TableCell>
//                 <TableCell className="py-2 w-60">{Number(item.cost)}</TableCell>
//                 <TableCell className="py-2">
//                   {Number(item.selling_price)}
//                 </TableCell>
//                 <TableCell className="py-2 w-20 flex gap-2 items-center">
//                   {item.quantity}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TableCell colSpan={4} className="text-right">
//                 Totals:
//               </TableCell>
//               <TableCell>{totals.stockValue}</TableCell>
//               <TableCell>{totals.sellValue}</TableCell>
//               <TableCell>{totals.quantity}</TableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </div>
//     </div>
//   );
// });

// DamageProductSlip.displayName = "DamageProductSlip";

// export default DamageProductSlip;
