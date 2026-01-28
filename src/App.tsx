import { useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { AppProvider } from './contexts';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes';

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      OneSignal.init({
        // appId: 'aa36eca4-4ff3-459c-befb-1d5b00151368',
        appId: '6436f910-8f77-4e50-985a-290f2ca0e43f',
        allowLocalhostAsSecureOrigin: false,
        welcomeNotification: {
          title: 'Bem vindo',
          message: 'Novo app configurado como modo notificação'
        },
      });
    }
  }, []);

  return (
    <AppProvider>

      <BrowserRouter>
        <Routes />
      </BrowserRouter>

    </AppProvider>
  )
}

export default App
