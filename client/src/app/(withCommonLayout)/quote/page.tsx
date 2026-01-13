"use client"; // ✅ এটা যোগ করুন

import Image from "next/image";
import Link from "next/link";
import { apiBaseUrl } from "@/config/config";
import { getUser } from "@/services/auth";
import { TProduct } from "@/types";
import { Key, ReactNode, useEffect, useState } from "react";
import NavBar from "@/components/pages/header/NavBar/NavBar";
import { addToQuote, getQuoteProducts } from "@/services/getQuote";
import { useSearchParams } from "next/navigation"; // ✅ Import করুন
import { toast } from "react-toastify";
import QuoteForm from "@/components/pages/quote/QuoteFrom";
// import { TbShoppingQuoteOff } from "react-icons/tb";
// import QuoteDelete from "@/components/actionButton/QuoteDelete";

const Quote = () => { // ✅ async সরিয়ে দিন
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Custom Quote Request State
  const [quoteRequest, setQuoteRequest] = useState<any>(null);

  // ✅ URL থেকে custom quote data নিন
  useEffect(() => {
    const hasQuoteParams = searchParams.get('productRef') || searchParams.get('productId');

    if (hasQuoteParams) {
      // Helper function to parse comma-separated values
      const parseMultipleValues = (value: string | null) => {
        if (!value) return null;
        const values = value.split(',').map(v => v.trim()).filter(v => v);
        return values.length > 1 ? values : (values[0] || null);
      };

      const quoteData = {
        productRef: searchParams.get('productRef') || searchParams.get('productId'),
        productId: searchParams.get('productId'),
        inventoryRef: searchParams.get('inventoryRef'),
        productName: searchParams.get('productName'),
        productThumbnail: searchParams.get('productThumbnail'),
        quantity: Number(searchParams.get('quantity')) || 1,
        price: Number(searchParams.get('price')) || 0,
        //  EMI ADD
        emiMonths: searchParams.get('emiMonths')
          ? Number(searchParams.get('emiMonths'))
          : null,
        fabric: parseMultipleValues(searchParams.get('fabrics') || searchParams.get('fabric')),
        fabricNote: searchParams.get('fabricNote'),
        color: parseMultipleValues(searchParams.get('colors') || searchParams.get('color')),
        colorNote: searchParams.get('colorNote'),
        size: parseMultipleValues(searchParams.get('sizes') || searchParams.get('size')),
        sizeNote: searchParams.get('sizeNote'),
        set: parseMultipleValues(searchParams.get('sets') || searchParams.get('set')),
        setNote: searchParams.get('setNote'),
        material: searchParams.get('material'),
        materialNote: searchParams.get('materialNote'),
      };

      console.log("Quote request data from URL:", quoteData);
      setQuoteRequest(quoteData);
    }
  }, [searchParams]);

  // ✅ Existing quote products load করুন
  useEffect(() => {
    const fetchQuoteProducts = async () => {
      try {
        const user = await getUser();
        const userId = user?.id;
        const coupon = "";
        const data = await getQuoteProducts(userId, coupon);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load quote products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuoteProducts();
  }, []);

  // ✅ Custom Quote Submit Handler
  const handleSubmitCustomQuote = async (formData: any) => {
    if (!quoteRequest) return;

    try {
      const user = await getUser();

      // Ensure productRef is present
      if (!quoteRequest.productRef) {
        throw new Error("Product reference is required");
      }

      const completeQuoteData = {
        ...quoteRequest,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        userRef: user?.id || formData.email, // Use user ID if logged in, otherwise use email as unique identifier
      };


      await addToQuote(completeQuoteData);

      toast.success('Custom quote added successfully!');
      setQuoteRequest(null);
      // Reload products
      const data = await getQuoteProducts(user?.id, "");
      setProducts(data);

    } catch (error) {
      console.error('Error submitting custom quote:', error);
      toast.error('Failed to submit custom quote: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <>
      <NavBar userCartProducts={products?.data?.QuoteDetails} />
      <div className="bg-gray-100">
        <div className="Container  w-full mx-auto md:px-20 xl:px-60 2xl:px-60 mt-22 2xl:mt-24">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <QuoteForm handleSubmitAll={handleSubmitCustomQuote} />
            {/* Custom Quote Request Display */}

            <div className=" bg-white col-span-2  rounded-md p-6  shadow-md">
              <h3 className="text-2xl font-bold text-[#262626] mb-4 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Your Custom Quote Request
              </h3>

              <div className=" rounded-xl p-5 space-y-4">
                {quoteRequest?.productName && (
                  <div className="flex items-start gap-4 pb-3 border-b">
                    {quoteRequest?.productThumbnail && (
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow">
                        <Image
                          src={apiBaseUrl + quoteRequest.productThumbnail}
                          alt={quoteRequest.productName}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-semibold">Product</p>
                      <p className="text-lg font-bold text-[#262626]">{quoteRequest.productName}</p>
                    </div>
                  </div>
                )}


                <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">


                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md">
                    <div className="flex-1">
                      <p className="text-xs uppercase p-2 rounded-md tracking-wide bg-gray-200 text-gray-500 font-semibold">
                        Product ID
                      </p>
                      <p className="text-base font-bold text-[#262626] mt-1">
                        {quoteRequest?.productId}
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-xs uppercase p-2 rounded-md tracking-wide bg-gray-200 text-gray-500 font-semibold">
                        Material
                      </p>
                      <p className="text-base font-semibold text-[#262626] mt-1">
                        {quoteRequest?.material}
                      </p>

                      {quoteRequest?.materialNote && (
                        <div className="mt-2 rounded-lg bg-gray-50 border-l-4 border-[#D4A373] p-2">
                          <p className="text-sm text-gray-600 italic">
                            <span className="font-medium text-gray-700">Your Choice:</span>{" "}
                            {quoteRequest?.materialNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-xs uppercase p-2 rounded-md tracking-wide bg-gray-200 text-gray-500 font-semibold">
                        Fabric
                      </p>
                      <div className="mt-2 space-y-2">
                        {Array.isArray(quoteRequest?.fabric) ? (
                          quoteRequest?.fabric.map((f: string, idx: number) => (
                            <p key={idx} className="text-base font-medium text-[#262626] bg-gray-50 p-2 rounded">
                              • {f}
                            </p>
                          ))
                        ) : (
                          <p className="text-base font-medium text-[#262626]">{quoteRequest?.fabric}</p>
                        )}
                      </div>
                      {quoteRequest?.fabricNote && (
                        <div className="mt-2 rounded-lg bg-gray-50 border-l-4 border-[#D4A373] p-2">
                          <p className="text-sm text-gray-600 italic">
                            <span className="font-medium text-gray-700">Your Choice:</span> {quoteRequest?.fabricNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-xs uppercase p-2 rounded-md tracking-wide bg-gray-200 text-gray-500 font-semibold">
                        Color
                      </p>
                      <div className="mt-2 space-y-2">
                        {Array.isArray(quoteRequest?.color) ? (
                          quoteRequest?.color?.map((c: string, idx: number) => (
                            <p key={idx} className="text-base font-medium text-[#262626] bg-gray-50 p-2 rounded">
                              • {c}
                            </p>
                          ))
                        ) : (
                          <p className="text-base font-medium text-[#262626]">{quoteRequest?.color}</p>
                        )}
                      </div>
                      {quoteRequest?.colorNote && (
                        <div className="mt-2 rounded-lg bg-gray-50 border-l-4 border-[#D4A373] p-2">
                          <p className="text-sm text-gray-600 italic">
                            <span className="font-medium text-gray-700">Your Choice:</span> {quoteRequest?.colorNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>



                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-xs uppercase p-2 rounded-md tracking-wide bg-gray-200 text-gray-500 font-semibold">
                        Size
                      </p>
                      <div className="mt-2 space-y-2">
                        {Array.isArray(quoteRequest?.size) ? (
                          quoteRequest?.size.map((s: string, idx: number) => (
                            <p key={idx} className="text-base font-medium text-[#262626] bg-gray-50 p-2 rounded">
                              • {s}
                            </p>
                          ))
                        ) : (
                          <p className="text-base font-medium text-[#262626]">{quoteRequest?.size}</p>
                        )}
                      </div>
                      {quoteRequest?.sizeNote && (
                        <div className="mt-2 rounded-lg bg-gray-50 border-l-4 border-[#D4A373] p-2">
                          <p className="text-sm text-gray-600 italic">
                            <span className="font-medium text-gray-700">Your Choice:</span> {quoteRequest?.sizeNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>



                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-xs uppercase p-2 rounded-md tracking-wide bg-gray-200 text-gray-500 font-semibold">
                        Set
                      </p>
                      <div className="mt-2 space-y-2">
                        {Array.isArray(quoteRequest?.set) ? (
                          quoteRequest?.set.map((st: string, idx: number) => (
                            <p key={idx} className="text-base font-medium text-[#262626] bg-gray-50 p-2 rounded">
                              • {st}
                            </p>
                          ))
                        ) : (
                          <p className="text-base font-medium text-[#262626]">{quoteRequest?.set}</p>
                        )}
                      </div>
                      {quoteRequest?.setNote && (
                        <div className="mt-2 rounded-lg bg-gray-50 border-l-4 border-[#D4A373] p-2">
                          <p className="text-sm text-gray-600 italic">
                            <span className="font-medium text-gray-700">Your Choice:</span> {quoteRequest?.setNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex-1">
                      <p className="text-xs uppercase p-2 rounded-md tracking-wide bg-gray-200 text-gray-500 font-semibold">
                        Quantity
                      </p>
                      <p className="text-3xl font-bold text-[#D4A373] mt-2">
                        {quoteRequest?.quantity}
                      </p>
                    </div>
                  </div>


                  {/* {quoteRequest?.price && quoteRequest.price > 0 && (
                    <div className="flex items-start gap-3 pb-3 bg-white rounded-lg p-4 shadow-sm">
                      <span className="text-xl">💰</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-semibold">Price</p>
                        <p className="text-base font-medium text-[#262626]">
                          ৳ {quoteRequest.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )} */}


                  {quoteRequest?.emiMonths && (
                    <div className="flex items-start gap-3 pb-3 bg-white rounded-lg p-4 shadow-sm">
                      <span className="text-xl">💳</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-semibold">EMI Plan</p>
                        <p className="text-base font-medium text-[#262626]">
                          {quoteRequest.emiMonths} Months
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

          </div>

          <div className="flex flex-col gap-8 justify-between items-center my-12">
            <Link
              href="/"
              className="text-white text-sm font-semibold rounded items-center text-center w-[70%] sm:w-[50%] md:w-[40%] bg-[#CCD5AE] hover:bg-[#D4A373] px-2 py-2 mt-3 duration-300"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quote;