import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MainProvider } from './context/GeneralContext';
import { CookiesProvider } from "react-cookie"
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === "production") disableReactDevTools()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <MainProvider>
        <App />
      </MainProvider>
    </CookiesProvider>
  </React.StrictMode>
);
