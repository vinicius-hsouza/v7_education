import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

function App() {
  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: 'aa36eca4-4ff3-459c-befb-1d5b00151368',
        // appId: '6436f910-8f77-4e50-985a-290f2ca0e43f'
        // You can add other initialization options here
        notifyButton: {
          enable: true,
        },
        // Uncomment the below line to run on localhost. See: https://documentation.onesignal.com/docs/local-testing
        allowLocalhostAsSecureOrigin: false,
        welcomeNotification: {
          title: 'Bem vindo',
          message: 'Novo app configurado como modo notificação'
        },
      });
    }
  }, []);

  return (
    <div className="p-8">
      <p>teste</p>
      <p>com notificação</p>
    </div>
  )
}

export default App
