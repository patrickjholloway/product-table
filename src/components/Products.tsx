import { FC, useEffect } from "react";

import { getProducts, useProductStore } from "../contexts/products";
import { ProductsTable } from "./ProductsTable";

export const Products: FC = () => {
    const { store, dispatch } = useProductStore();

    useEffect(() => {
        getProducts(store, dispatch);
    }, []);

    return <ProductsTable loading={store.loading} products={store.products} errors={store.errors}></ProductsTable>
}