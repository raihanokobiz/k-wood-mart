import NavBar from '@/components/pages/header/NavBar/NavBar'
import { getUser } from '@/services/auth';
import { getCartProducts } from '@/services/cart';
import Image from 'next/image';
import React from 'react'
import Collections from './Collections';
import C1 from '../../../assets/collection/C1.webp'

export default async function CollectionsPage() {
    const user = await getUser();
    const userId = user?.id;
    const coupon = "";
    const cartProducts = await getCartProducts(userId, coupon);

    return (
        <div className="">
            <NavBar userCartProducts={cartProducts?.data} />
            <div className="min-h-screen Container mt-14">
                {/* Sub Banner */}
                <div className="mb-12 relative overflow-hidden  h-96 md:h-[450px]">
                    <Image
                        src={C1}
                        fill
                        className="object-cover"
                        alt="Collections Banner"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center px-6">
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                Our Collections
                            </h1>
                            <p className="text-lg md:text-xl">
                                Explore timeless furniture for your space
                            </p>
                        </div>
                    </div>
                </div>
                <Collections />
            </div>
        </div>
    )
}
