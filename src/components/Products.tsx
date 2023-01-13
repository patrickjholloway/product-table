import { FC, Fragment, useEffect } from "react";

import { getProducts, Product, useProductStore } from "../contexts/products";

export const Products: FC = () => {
    const { store, dispatch } = useProductStore();
    
    useEffect(() => {
        getProducts(store, dispatch);
    }, []);

       return <ProductsTable loading={store.loading} products={store.products} errors={store.errors}></ProductsTable>
}

interface ProductsTableProps { products: Product[], loading: boolean, errors: string[]};

const ProductsTable: FC<ProductsTableProps> = ({products, loading,  errors}) => {
    return <Fragment>
        <h2>{products.length} Products</h2>
    </Fragment>
}