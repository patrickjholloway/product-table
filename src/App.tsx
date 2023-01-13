import React from 'react';
import { Products } from './components/Products';
import { ProductStoreProvider } from './contexts/products';

function App() {
  return (
    <div className="app-container">
      <ProductStoreProvider>
        <Products></Products>
      </ProductStoreProvider>
    </div>
  );
}

export default App;
