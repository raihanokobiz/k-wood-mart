"use client";

import React from "react";
import { formatDate } from "date-fns";
import Barcode from "react-barcode";
import { TOrder } from "@/types/shared";
import { upperCase, upperFirst } from "lodash";
import { BRAND_NAME } from "@/config/config";
import { makeBDPrice } from "@/utils/helpers";

interface PrintInvoiceProps {
  orderData: TOrder;
}

const PrintInvoice = React.forwardRef<HTMLDivElement, PrintInvoiceProps>(
  ({ orderData }, ref) => {
    const totalQuantity = orderData.products?.reduce(
      (acc, current) => acc + Number(current?.quantity),
      0
    );

    console.log("order ptoduct", orderData);

    const grandTotal =
      (orderData?.totalPrice ?? 0) +
      (orderData?.shippingCost ?? 0) -
      (orderData?.couponDiscount ?? 0);
    return (
      <div
        ref={ref}
        className="w-[80mm] mx-auto border px-2 py-[30px] text-xs font-medium"
      >
        <div className="w-full flex flex-col justify-center items-center text-center py-2">
          <img
            src="/logo/main.png"
            alt={BRAND_NAME}
            className="h-[1.5cm] object-cover"
          />
          <p className="mt-2">{BRAND_NAME}</p>
          {/* <p className="text-[10px]">Address</p> */}
          <div className="flex items-center justify-start text-[10px]">
            <span>Hotline:</span> <span className="">+8801735775093</span>
          </div>
          <p className=" text-[10px]">Email : support@nohasan.com</p>
          <p className=" text-[10px]">Website : www.nohasan.com</p>
        </div>

        <div className="w-full border-b border-[#000000] py-2">
          <div className="flex justify-between items-center">
            <p className="">Order ID : </p>
            <h1 className="font-bold">{orderData.orderId}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="">Date:</p>{" "}
            <p className="font-bold">
              {formatDate(String(orderData.createdAt), "dd/MM/yyyy")}
            </p>
          </div>
          {/* <div className="flex justify-between items-center">
            <p className="">Cashier : </p>
            <p className="">user name</p>
          </div> */}
        </div>

        <div className="w-full py-2 border-b border-[#000000]">
          <div className="flex justify-between items-center">
            <p className="">Customer:</p>
            <h1 className="font-bold">{upperFirst(orderData.customerName)}</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="">Phone:</p>
            <h1 className="font-bold">{orderData.customerPhone}</h1>
          </div>
        </div>

        <div className="w-full">
          {orderData?.products?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-end py-2 border-b border-[#000000]"
            >
              <div className="flex w-5/6">
                <p>#{index + 1}.</p>
                <p>{`${item?.productRef?.name} - ${
                  item?.inventoryRef?.name
                    ? upperCase(item?.inventoryRef?.name)
                    : "N/A"
                } - ${
                  item?.inventoryRef?.level
                    ? upperCase(item?.inventoryRef?.level)
                    : "N/A"
                }, Unit: ${item?.quantity} x ${makeBDPrice(item?.price)}`}</p>
              </div>
              <h1 className="font-bold w-1/6">
                {makeBDPrice(Number(item?.price) * Number(item?.quantity))}
              </h1>
            </div>
          ))}
        </div>

        <div className="">
          <div className="py-2 border-b border-[#000000] border-dashed">
            <div className="flex justify-between items-center">
              <p>Total Quantity:</p>
              <h1 className="">{totalQuantity}</h1>
            </div>
            <div className="flex justify-between items-center">
              <p>Subtotal:</p>
              <h1 className="">
                {orderData.totalPrice === null
                  ? 0
                  : makeBDPrice(orderData.totalPrice || 0)}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="">Discount:</p>
              <h1 className="">
                {orderData.couponDiscount === null
                  ? 0
                  : makeBDPrice(orderData.couponDiscount || 0)}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="">Delivery Charge:</p>
              <h1 className="">
                {orderData.shippingCost === null
                  ? 0
                  : makeBDPrice(orderData.shippingCost || 0)}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-bold">Grand Total:</p>
              <h1 className="font-bold">{grandTotal}</h1>
            </div>
          </div>
          {/* <div className="py-2 border-b border-[#000000] border-dashed">
            <div className="flex justify-between items-center">
              <p className="">Advance:</p>
              <h1 className="">
                {orderData.paid_amount === null ? 0 : orderData.paid_amount}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="">Due Amount:</p>
              <h1 className="">
                {orderData.due_amount === null ? 0 : orderData.due_amount}
              </h1>
            </div>
          </div> */}
        </div>

        <div className="py-2 border-b border-[#000000] text-center">
          <p>
            Items may be exchanged subject to {BRAND_NAME || ""} sales policies
            within 7days. No cash refund is applicable.
          </p>
        </div>

        <div className="flex flex-col justify-center items-center py-2">
          <p className="text-center">THANK YOU FOR SHOPPING !</p>
          <Barcode
            value={orderData.orderId}
            width={1.4}
            height={25}
            fontSize={10}
          />
        </div>
      </div>
    );
  }
);

PrintInvoice.displayName = "PrintInvoice";

export default PrintInvoice;
