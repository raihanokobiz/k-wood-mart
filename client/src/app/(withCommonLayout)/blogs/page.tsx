import NavBar from "@/components/pages/header/NavBar/NavBar";
import BlogCard from "@/components/pages/landing_pages/BlogCard/BlogCard";
import { getUser } from "@/services/auth";
import { getAllBlogs } from "@/services/blogs";
import { getCartProducts } from "@/services/cart";
import React from "react";

// Define the Blog type
type Blog = {
  id: string;
  title: string;
  details: string;
  image: string;
  tags: string[];
  createdAt: string;
  author: string;
  slug: string;
};

const page = async () => {
  const user = await getUser();
  const userRef = user?.id;
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);
  const allBlogs = await getAllBlogs();
  console.log("allBlogs", allBlogs);
  return (
    <div>
      <NavBar userCartProducts={userCartProducts?.data} />
      <div className="Container py-12 lg:mt-0 mt-20">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
          {/*  alBlogs map  */}
            {
            Array.isArray(allBlogs?.data) &&
            allBlogs?.data?.map((blog: Blog) => (
              <BlogCard
              key={blog.id}
              title={blog.title}
              details={blog.details}
              image={blog.image}
              tags={blog.tags}
              date={blog.createdAt}
              author={blog.author}
              slug={blog.slug}
              />
            ))
            }
        </div>
      </div>
    </div>
  );
};

export default page;
