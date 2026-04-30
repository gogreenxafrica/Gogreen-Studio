import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './AppContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <Toaster 
        position="top-center" 
        containerStyle={{
          zIndex: 999999,
        }}
        toastOptions={{
          duration: 4000,
          className: '!bg-white/80 !backdrop-blur-2xl !text-gray-900 !font-bold !text-[15px] !rounded-[24px] !px-6 !py-4 !shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] !border !border-white/60',
          success: {
            iconTheme: {
              primary: '#2da437',
              secondary: '#ffffff',
            },
          },
          error: {
            className: '!bg-red-50/80 !backdrop-blur-2xl !text-red-600 !font-bold !text-[15px] !rounded-[24px] !px-6 !py-4 !shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] !border !border-red-200/60',
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </AppProvider>
  </React.StrictMode>
);