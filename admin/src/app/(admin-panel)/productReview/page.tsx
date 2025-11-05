import React from 'react'
import { ContentLayout } from '../../../components/admin-panel/content-layout'
import CreateProductReviewForm from './CreateProductReviewForm'
import ProductReviewTable from './ProductReviewTable'
import { getProductReviewWithPagination } from './productReviewAction';

interface Props {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function ProductReviewpage({ searchParams }: Props) {
    const page = Array.isArray(searchParams.page)
        ? searchParams.page[0]
        : searchParams.page || "1";
    const limit = Array.isArray(searchParams.limit)
        ? searchParams.limit[0]
        : searchParams.limit || "10";

    const { data } = await getProductReviewWithPagination({ page: 1, limit: 100 })

    console.log(data);


    return (
        <ContentLayout title="Product">
            <ProductReviewTable
                data={data.result}
                pagination={{
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: data.pagination.total,
                }}
            />

        </ContentLayout>
    )
}
