import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useReducer,
} from "react";

const PRODUCTS_URL = "https://dummyjson.com/products" as const;

export interface Product {
    brand: string;
    category: string;
    description:  string;
    discountPercentage:  number;
    id:  number;
    images: string[];
    price: number;
    rating: number;
    stock: number;
    thumbnail: string;
    title: string;
}

interface ProductsStore {
    products: Product[];
    limit: number,
    skip: number,
    total: number,
    errors: string[];
    loading: boolean;
}

const ProductsContext = createContext<ProductsStore>({
    products: [],
    loading: false,
    limit: 30,
    skip: 0,
    total: 0,
    errors: [],
});

enum ProductActionName {
    FetchStart = "FETCH_START",
    FetchError = "FETCH_ERROR",
    FetchComplete = "FETCH_COMPLETE",
}

const useProductsReducer = (state: ProductsStore) => {
    return useReducer(
        (
            state: ProductsStore,
            action: { type: ProductActionName; payload?: any }
        ) => {
            switch (action.type) {
                case "FETCH_START":
                    return {
                        ...state,
                        loading: true,
                    };
                case "FETCH_ERROR":
                    return {
                        ...state,
                        errors: ["There was an error loading this content"],
                        loading: false,
                    };
                case "FETCH_COMPLETE": {
                    return {
                        ...state,
                        products: action.payload.products,
                        loading: false,
                    };
                }
                default:
                    throw new Error();
            }
        },
        {
            products: [],
            loading: false,
            errors: [],
            limit: 30,
            skip: 0,
            total: 0
        }
    );
};


const getProducts = (
    store: ProductsStore,
    dispatch: ProductDispatcher
) => {
    dispatch({ type: ProductActionName.FetchStart });
    (async () => {
        try {
            const productsReq = await fetch(PRODUCTS_URL);
            const { products, limit, skip, total } = await productsReq.json();
            dispatch({ type: ProductActionName.FetchComplete, payload: { products, limit, skip, total } });
        } catch (e) {
            dispatch({ type: (ProductActionName.FetchError) });
        }
    })();
};

interface ProductAction {
    type: ProductActionName;
    payload?: any;
}
type ProductDispatcher = React.Dispatch<ProductAction>;


const DispatchContext = createContext<{ dispatch: ProductDispatcher }>({
    dispatch: (((value: {type: ProductActionName, payload?: any}) => { }) satisfies ProductDispatcher),
});

const ProductStoreProvider: FC<
    PropsWithChildren & { value?: ProductsStore }
> = ({ children, value: initialState }) => {
    const defaultInitialState: ProductsStore = {
        products: [],
        loading: false,
        errors: [],
        limit: 30,
        skip: 0,
        total: 0
    };
    const [state, dispatch] = useProductsReducer(initialState || defaultInitialState);

    return (
        <DispatchContext.Provider value={{dispatch: (dispatch satisfies ProductDispatcher)}}>
            <ProductsContext.Provider value={{ ...state }}>
                {children}
            </ProductsContext.Provider>
        </DispatchContext.Provider>
    );
};

function useProductStore() {
    const { dispatch } = useContext(DispatchContext);
    return { store: useContext(ProductsContext), dispatch };
}



export { ProductStoreProvider, useProductStore, getProducts };

