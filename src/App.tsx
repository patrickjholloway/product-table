import { Global } from '@emotion/react';
import { useTheme2 } from '@grafana/ui';
import React from 'react';
import { Products } from './components/Products';
import { ProductStoreProvider } from './contexts/products';

function App() {
  const theme = useTheme2();
  return (
    <div className="app-container">
      <Global styles={{
        body: {
          backgroundColor: theme.colors.background.primary,
          color: theme.colors.text.primary
        }
      }}></Global>
      <ProductStoreProvider>
        <Products></Products>
      </ProductStoreProvider>
    </div>
  );
}

export default App;
