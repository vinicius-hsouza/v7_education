import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { Routes } from "./routes";
import './index.css'

function App() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      OneSignal.init({
        appId: '6436f910-8f77-4e50-985a-290f2ca0e43f',
        allowLocalhostAsSecureOrigin: false,
        welcomeNotification: {
          title: "Bem vindo",
          message: "Novo app configurado como modo notificação",
        },
      });
    }
  }, []);

  return <Routes />;
}

export default App;

