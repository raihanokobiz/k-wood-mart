import { apiBaseUrl } from "@/config/config";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";

export type BlogCardProps = {
  title: string;
  details: string;
  image: string;
  tags: string[];
  date: string | Date;
  author: string;
  slug: string;
};

  const BlogCard: React.FC<BlogCardProps> = ({ title, details, image,  slug }) => {
  return (
    <div className="group">
      <Link href={`blogs/${slug}`}>
        <div className="p-2 border border-[#CCD5AE] rounded overflow-hidden h-[350px] lg:h-[260px] xl:h-[350px] ">
          <Image
            src={apiBaseUrl + image}
            alt=""
            width={350}
            height={350}
            className="w-full h-full rounded cursor-pointer group-hover:scale-110 duration-500"
          />
        </div>
      </Link>
      <div className="px-2 py-2">
        <Link href={`blogs/${slug}`}>
          <h2 className="lg:text-lg text-base font-semibold line-clamp-1 text-[#D4A373] cursor-pointer">
            {title}
          </h2>
        </Link>
        <Link href={`blogs/${slug}`}>
          <p className="mt-2 text-[#262626]/60 line-clamp-2 cursor-pointer">
           <span dangerouslySetInnerHTML={{ __html: details }} />
          </p>
        </Link>
        <Link href={`blogs/${slug}`}>
          <div className="flex items-center gap-1 mt-2 font-semibold cursor-pointer text-[#262626]/60 group-hover:text-[#262626]">
            <span>Read More</span>
            <span className="mt-1">
              <BsArrowRight />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
