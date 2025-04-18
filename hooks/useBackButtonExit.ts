// hooks/useBackButtonExit.ts
import { useEffect, useRef } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { usePathname } from "expo-router";

const MAIN_ROUTES = ["/(withAccount)/Home", "/(withAccount)/Favoris/Favori", "/(withAccount)/Dossiers/Dossier"];

export default function useBackButtonExit() {
  const pathname = usePathname();
  const backPressCount = useRef(0);

  useEffect(() => {
    const onBackPress = () => {
      if (MAIN_ROUTES.includes(pathname)) {
        if (backPressCount.current === 0) {
          ToastAndroid.show("Appuyez encore pour quitter", ToastAndroid.SHORT);
          backPressCount.current = 1;
          setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      }

      // autoriser retour si pas dans les pages principales
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => backHandler.remove();
  }, [pathname]);
}
