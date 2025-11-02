import { GiWoodBeam } from "react-icons/gi";
import { FaCouch } from "react-icons/fa";
import { MdLocalShipping, MdOutlineDesignServices } from "react-icons/md";

export default function WhyChooseUs() {
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

  return (
    <section className="pb-4 md:px-6 lg:px-8">
      <h2
        className="rounded text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Why Choose WoodMart?
      </h2>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md shadow-gray-200 rounded p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
