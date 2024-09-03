import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

function App() {
  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: '8e4cfc95-5c63-4739-bc9d-9e2bde2fc855',
        // You can add other initialization options here
        notifyButton: {
          enable: true,
        },
        // Uncomment the below line to run on localhost. See: https://documentation.onesignal.com/docs/local-testing
        // allowLocalhostAsSecureOrigin: true
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
