import React from "react";
import { StatusBar } from "react-native";
import SplashScreen from "./SplashScreen";

export default function Index() {
  return (
    <>
      <StatusBar backgroundColor="#FF4500" barStyle="light-content" />
      <SplashScreen />
    </>
  );
}
