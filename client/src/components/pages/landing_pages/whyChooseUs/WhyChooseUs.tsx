"use client";
import { FaCouch } from "react-icons/fa";
import { MdLocalShipping, MdOutlineDesignServices } from "react-icons/md";
import { GiWoodBeam } from "react-icons/gi";
import { motion } from "framer-motion";

export default function WhyChooseSection() {
  const reasons = [
    {
      icon: <GiWoodBeam className="mx-auto text-5xl text-[#ed1c24]" />,
      title: "Premium Solid Wood",
      description: "Handpicked timber from sustainable sources",
    },
    {
      icon: <FaCouch className="mx-auto text-5xl text-[#ed1c24]" />,
      title: "Tailor-Made Curtains",
      description: "Custom designs for your unique windows",
    },
    {
      icon: <MdLocalShipping className="mx-auto text-5xl text-[#ed1c24]" />,
      title: "Fast Delivery",
      description: "Safe delivery within 3-7 working days",
    },
    {
      icon: (
        <MdOutlineDesignServices className="mx-auto text-5xl text-[#ed1c24]" />
      ),
      title: "Expert Consultation",
      description: "Free interior design guidance",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 2,
        delay: i * 0.2,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div className="my-6 md:my-8 2xl:my-12 relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2023/06/10/18/09/room-8054612_640.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 Container">
        {/* Heading */}
        <motion.div
          className="text-center mb-6 md:mb-10 lg:mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white mb-4">
            Why Choose WoodMart?
          </h2>
          <motion.div
            className="w-24 h-1 bg-amber-500 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Reasons Grid */}
        <motion.div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-8 
                         hover:bg-white/20 transition-all duration-300 
                         border border-white/20 hover:border-amber-500/50
                         hover:shadow-2xl hover:shadow-amber-500/20
                         hover:-translate-y-2"
            >
              {/* Icon */}
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.3 }}>
                <div
                  className="text-amber-500 group-hover:text-amber-400 
                              transition-colors duration-300 
                              group-hover:scale-110 transform"
                >
                  {reason.icon}
                </div>
              </motion.div>

              {/* Title */}
              <h3
                className=" text-md lg:text-2xl font-bold text-white text-center mb-4 
                           group-hover:text-amber-400 transition-colors duration-300"
              >
                {reason.title}
              </h3>

              {/* Description */}
              <p className=" hidden md:block text-md lg:text-2xl text-gray-300 text-center leading-relaxed">
                {reason.description}
              </p>

              {/* Decorative corner */}
              <div
                className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 
                            border-amber-500/30 group-hover:border-amber-500 
                            transition-colors duration-300"
              ></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-6 md:mt-10 lg:mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex gap-2">
            {[1, 0.5, 0.3].map((opacity, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-500"
                style={{ opacity }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating decoration elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}
