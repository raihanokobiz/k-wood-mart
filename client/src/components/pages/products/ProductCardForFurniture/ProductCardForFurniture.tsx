import { apiBaseUrl } from '@/config/config'
import Image from 'next/image'

export default function ProductCardForFurniture({ product }) {
    return (
        <div
            className="bg-white  text-center mb-8 border  border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
            <div className=" relative h-[500px] mb-4">
                <Image
                    src={apiBaseUrl + product?.thumbnailImage}
                    alt={product?.name}
                    fill
                    className="mx-auto mb-4"
                />
            </div>
            <div className="flex items-center justify-between text-xl font-medium text-secondary text-secondaryt p-4 ">
                <h3 className="">
                    {product?.name}
                </h3>
                <p className="" style={{ fontVariantNumeric: 'lining-nums' }}>
                    ৳ {product?.price
                    }
                </p>
            </div>
        </div>
    )
}
