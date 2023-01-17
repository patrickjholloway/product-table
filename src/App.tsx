import { createTheme } from '@grafana/data';
import { GlobalStyles, ThemeContext } from '@grafana/ui';
import React from 'react';
import { Products } from './components/Products';
import { ProductStoreProvider } from './contexts/products';

import './App.css';

function App() {
  const theme = createTheme({ colors: { mode: 'dark' } });

  return (
      <ThemeContext.Provider value={theme}>
        <GlobalStyles></GlobalStyles>
        <ProductStoreProvider>
          <Products></Products>
        </ProductStoreProvider>
      </ThemeContext.Provider>
  );
}

export default App;
