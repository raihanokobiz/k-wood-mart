// "use client";

// import React, { useMemo, useRef } from "react";
// import Image from "next/image";
// import { Branches, Customers, SalesData, Settings, User } from "@/types/shared";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import {
//   Boxes,
//   ClipboardCheck,
//   ScrollText,
//   ShoppingBag,
//   Users,
//   UsersRound,
// } from "lucide-react";
// import { Label } from "@radix-ui/react-label";
// import { getSetting } from "@/services/settings";
// import { fileUrlGenerator, makeBDPrice } from "@/utils/helpers";
// import logo from "@/assets/images/Bizpos-LOGO-BLACK.png";
// import { useReactToPrint } from "react-to-print";
// import { StockPayload } from "@/app/(admin-panel)/stock-transfer/transfer-products/transfer-layout";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Button } from "../ui/button";
// import { ubuntu } from "../print-pages/challan-print";

// interface ReportPageProps {
//   salesData: SalesData[];
//   branches: Branches[];
//   customers: Customers[];
//   // stocks: StockPayload[];
//   // show: string;
//   users: User[];
//   totalSales: number;
//   totalCOGS: number;
//   totalOrders: number;
//   totalStockValue: number;
//   branchWiseTotals: Record<
//     number,
//     { totalSales: number; totalCOGS: number; totalOrders: number }
//   >;
// }

// const ReportPage = React.forwardRef<HTMLDivElement, ReportPageProps>(
//   (
//     {
//       salesData,
//       branches,
//       customers,
//       // stocks,
//       // show,
//       users,
//       totalSales,
//       totalCOGS,
//       totalOrders,
//       totalStockValue,
//       branchWiseTotals,
//     },
//     ref
//   ) => {
//     // Calculate additional totals
//     const totalDueAmount = salesData.reduce(
//       (total, order) => total + (order.due_amount || 0),
//       0
//     );
//     const totalPaidAmount = salesData.reduce(
//       (total, order) => total + (order.paid_amount || 0),
//       0
//     );
//     const totalProfit = totalSales - totalCOGS;

//     // Define columns
//     const columns = useMemo<ColumnDef<any>[]>(
//       () => [
//         { accessorKey: "name", header: "Branch" },
//         {
//           accessorKey: "sales",
//           header: "Total Sales",
//           cell: ({ row }) => makeBDPrice(row.original.sales),
//         },
//         {
//           accessorKey: "cogs",
//           header: "Total COGS",
//           cell: ({ row }) => makeBDPrice(row.original.cogs),
//         },
//         { accessorKey: "orders", header: "Total Orders" },
//       ],
//       []
//     );

//     // Prepare data for table
//     const tableData = branches.map((branch) => ({
//       name: branch.name,
//       sales: branchWiseTotals[Number(branch.id)]?.totalSales || 0,
//       cogs: branchWiseTotals[Number(branch.id)]?.totalCOGS || 0,
//       orders: branchWiseTotals[Number(branch.id)]?.totalOrders || 0,
//     }));

//     const table = useReactTable({
//       columns,
//       data: tableData,
//       getCoreRowModel: getCoreRowModel(),
//     });

//     return (
//       <div className="w-[8in] h-screen mx-auto">
//         <div ref={ref} className="m-1 px-8 py-4">
//           {/* Header Section */}
//           <div className="w-full border-b border-gray-700 p-2 flex items-center justify-between mb-4">
//             <div className="w-1/5">
//               {/* {logoUrl ? (
//                         <Image src={logoUrl} alt="Bizpos Logo" width={100} height={50} />
//                       ) : (
//                         <p className="w-full flex justify-start items-center text-3xl font-bold">
//                           {BRAND_NAME}
//                         </p>
//                       )} */}
//               <img
//                 src="/images/maclink-logo-140x80px.png"
//                 alt="Maclink Logo"
//                 className="h-full object-cover"
//               />
//             </div>
//             <div className="w-2/5 text-start pl-4">
//               <p className={`${ubuntu.className} font-bold`}>
//                 MACLINK INTERNATIONAL
//               </p>
//             </div>
//             <div className="w-2/5 text-end">
//               <p className="text-sm font-semibold">Sales & Inventory Report</p>
//             </div>
//           </div>

//           {/* Summary Table */}
//           <table className="w-full border-collapse border border-gray-300 mb-6 text-xs">
//             <tbody>
//               <tr>
//                 <td className="p-2 border">Total Sales</td>
//                 <td className="p-2 border">{makeBDPrice(totalSales)}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Total COGS</td>
//                 <td className="p-2 border">{makeBDPrice(totalCOGS)}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Profit</td>
//                 <td className="p-2 border">{makeBDPrice(totalProfit)}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Total Due Amount</td>
//                 <td className="p-2 border">{makeBDPrice(totalDueAmount)}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Total Paid Amount</td>
//                 <td className="p-2 border">{makeBDPrice(totalPaidAmount)}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Total Stock Value</td>
//                 <td className="p-2 border">{makeBDPrice(totalStockValue)}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Total Orders</td>
//                 <td className="p-2 border">{totalOrders}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Total Customers</td>
//                 <td className="p-2 border">{customers.length}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 border">Total Staff</td>
//                 <td className="p-2 border">{users.length}</td>
//               </tr>
//             </tbody>
//           </table>

//           {/* Branch-wise Breakdown Table */}
//           <h3 className="text-sm font-bold mb-2">Branch-wise Breakdown</h3>
//           <table className="w-full border-collapse border border-gray-300 text-xs">
//             <thead>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id} className="bg-gray-200">
//                   {headerGroup.headers.map((header) => (
//                     <th key={header.id} className="p-2 border">
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody>
//               {table.getRowModel().rows.map((row) => (
//                 <tr key={row.id} className="border">
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id} className="p-2 border">
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }
// );

// ReportPage.displayName = "ReportPage";

// export default ReportPage;
