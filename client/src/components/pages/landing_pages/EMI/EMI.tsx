import Image from "next/image";
import Link from "next/link";
import E1 from "../../../../assets/emi/E5.jpg"


const interestRates = [
    { termMonths: 3, interestRate: 0 },
    { termMonths: 6, interestRate: 5 },
    { termMonths: 9, interestRate: 8 },
    { termMonths: 12, interestRate: 9 },
];

export default async function EMI() {

    return (
        <div className="Container">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center overflow-hidden">

                {/* Left - Image */}
                <div className="relative h-[400px] lg:h-[503px]">
                    <Image
                        src={E1}
                        alt="Furniture"
                        fill
                        className="object-cover rounded"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /> */}

                    {/* 0% Badge */}
                    <div className="absolute top-6 left-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
                        <p className="text-sm font-medium">Starting from</p>
                        <p className="text-3xl font-bold">0% EMI</p>
                    </div>
                </div>

                {/* Right - EMI Details */}
                <div className="p-8 lg:p-14 bg-[#5e828a] rounded">

                    {/* Title */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2 text-center">
                            Flexible Payment Plans
                        </h3>
                        <p className="text-white text-center">
                            Choose your preferred EMI tenure with transparent pricing
                        </p>
                    </div>

                    {/* EMI Table */}
                    <div className=" rounded-xl p-6 mb-6">
                        <h4 className="text-lg font-semibold text-white mb-4 text-center">
                            Interest Rates
                        </h4>

                        <div className="grid grid-cols-4 gap-3">
                            {interestRates.map((rate, idx) => (
                                <div
                                    key={idx}
                                    className="text-center p-4 rounded-lg transition-all bg-white">
                                    <p className="text-2xl font-bold text-gray-900 mb-1">
                                        {rate.termMonths}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-2">Months</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {rate.interestRate}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center items-center">
                        <Link
                            href="/emi"
                            className="w-fit bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            Know More
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}