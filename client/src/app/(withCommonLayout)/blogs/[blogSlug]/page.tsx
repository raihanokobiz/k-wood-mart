import NavBar from "@/components/pages/header/NavBar/NavBar";
import { apiBaseUrl } from "@/config/config";
import { getUser } from "@/services/auth";
import { getSingleBlogBySlug } from "@/services/blogs";
import { getCartProducts } from "@/services/cart";

import Image from "next/image";
import React from "react";
import { FaRegUser } from "react-icons/fa";

interface PageProps {
  params: Promise<{
    blogSlug: string;
  }>;
}

const page: React.FC<PageProps> = async ({ params }) => {
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);

  const resolvedParams = await params;
  console.log("Slug param --->", resolvedParams.blogSlug);

  const singleBlog = await getSingleBlogBySlug(resolvedParams.blogSlug);

  console.log("singleBlog", singleBlog);
  return (
    <div>
      <NavBar userCartProducts={products?.data} />
      <div className="Container py-8 lg:mt-0 mt-20 2xl:px-100 xl:px-40 lg:px-14 ">
        <div className="">
          <div className="xl:h-[500px] lg:h-[450px] h-[320px] rounded p-2 border border-[#CCD5AE]">
            <Image
              src={apiBaseUrl + singleBlog?.data?.image}
              alt=""
              width={500}
              height={500}
              className="w-full h-full object-fit rounded"
            />
          </div>

          <div className="py-4">
            {singleBlog?.data?.author && (
              <div className="flex items-center gap-2">
                <span className="p-1 rounded border border-[#D4A373] text-[#D4A373]">
                  <FaRegUser className="text-[12px]" />
                </span>

                <h2 className="font-medium">{singleBlog?.data?.author}</h2>
              </div>
            )}
            <h2 className="md:text-2xl text-xl mt-3">
              {singleBlog?.data?.title}
            </h2>
            <p className="mt-2 text-[#262626]/80">
              <span
                dangerouslySetInnerHTML={{ __html: singleBlog?.data?.details }}
              />
            </p>

            <div className="flex items-center gap-2 py-4">
              <h2 className="text-xl font-semibold">Tags :</h2>
              <div className="flex items-center justify-center gap-2">
                {singleBlog?.data?.tags.map((tag: string, index: number) => (
                  <p
                    key={index}
                    className="px-2 py-1 border border-[#D4A373] text-[#D4A373] text-sm font-semibold rounded"
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
