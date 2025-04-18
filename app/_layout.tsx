// app/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(withoutAccount)/SongListScreen" />
          <Stack.Screen name="(withoutAccount)/LessonListScreen" />
          <Stack.Screen name="(withoutAccount)/SongDetailScreen/[id]" /> 
          <Stack.Screen name="(withoutAccount)/LessonDetailScreen/[id]" /> 
          <Stack.Screen name="(welcome)/WelcomeScreen1" />
          <Stack.Screen name="(welcome)/WelcomeScreen2" />
          <Stack.Screen name="(welcome)/WelcomeScreen3" />
          <Stack.Screen name="(auth)/ChooseLoginType" />
          <Stack.Screen name="(auth)/Login" />
          <Stack.Screen name="(auth)/Register" />
          <Stack.Screen name="(withAccount)/Home" />
          <Stack.Screen name="(withAccount)/Favoris/Favori" />
          <Stack.Screen name="(withAccount)/Dossiers/Dossier" />
        </Stack>
        <Toast />
      </View>
    </GestureHandlerRootView>
  );
}
