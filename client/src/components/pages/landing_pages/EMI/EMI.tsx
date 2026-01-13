'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from 'framer-motion';
import E1 from "../../../../assets/emi/E5.jpg";

// const interestRates = [
//     { termMonths: 3, interestRate: 0 },
//     { termMonths: 6, interestRate: 5 },
//     { termMonths: 9, interestRate: 8 },
//     { termMonths: 12, interestRate: 9 },
// ];

export default function EMI({ emiPlans }: { emiPlans: any[] }) {

    // =======================
    // Variants for Animation
    // =======================
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" as const }
        }
    };

    const contentVariants: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: "easeOut" as const }
        }
    };

    const badgeVariants: Variants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.3 }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.3, delay: i * 0.1, ease: "easeOut" as const }
        })
    };

    //  only one active EMI config
    const activeEmiPlan = emiPlans?.data?.find(
        (item: any) => item.isActive === true
    );

    //  plans map
    const interestRates =
        activeEmiPlan?.plans?.map((plan: any) => ({
            termMonths: plan.months,
            interestRate: plan.interestRate,
        })) || [];


    // =======================
    // Render Component
    // =======================


    return (
        <div className="Container">
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >

                {/* Left - Image */}
                <motion.div className="relative h-[200px] md:h-[400px] lg:h-[503px]"
                    variants={imageVariants}
                >
                    <Image
                        src={E1}
                        alt="Furniture"
                        fill
                        className="object-cover rounded"
                    />

                    {/* 0% Badge */}
                    <motion.div className="absolute top-6 left-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
                        variants={badgeVariants}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-sm font-medium">Starting from</p>
                        <p className="text-3xl font-bold">0% EMI</p>
                    </motion.div>
                </motion.div>

                {/* Right - EMI Details */}
                <motion.div className="p-4 md:p-8 lg:p-14 bg-[#5e828a] rounded"
                    variants={contentVariants}
                >

                    {/* Title */}
                    <motion.div className="mb-2 md:mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-2 text-center">
                            Flexible Payment Plans
                        </h3>
                        <p className="text-white text-center">
                            Choose your preferred EMI tenure with transparent pricing
                        </p>
                    </motion.div>

                    {/* EMI Table */}
                    <div className="rounded-xl md:p-6 mb-6">
                        <motion.h4 className="text-lg font-semibold text-white mb-4 text-center"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Interest Rates
                        </motion.h4>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {interestRates.map((rate, idx) => (
                                <motion.div
                                    key={idx}
                                    className="text-center p-4 rounded-lg transition-all bg-white"
                                    custom={idx}
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    whileHover={{
                                        y: -8,
                                        scale: 1.05,
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                                    }}
                                >
                                    <p className="text-2xl font-bold text-gray-900 mb-1">
                                        {rate.termMonths}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-2">Months</p>
                                    <motion.p className="text-xl font-bold text-gray-900"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 + idx * 0.1, type: "spring" }}
                                    >
                                        {rate.interestRate}%
                                    </motion.p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div className="flex justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <Link
                            href="/emi"
                            className="w-fit bg-[#D4A373] hover:bg-[#c49761] text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            Know More
                        </Link>
                    </motion.div>

                </motion.div>
            </motion.div>
        </div>
    );
}
