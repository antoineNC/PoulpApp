import { useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUnit } from "effector-react";

import { useOffice, usePost } from "@firebase";
import TabBarContainer from "@navigation/tabBarContainer";
import { AuthParamList } from "@navigation/navigation.types";
import LoginScreen from "@screens/auth/login";
import SignupScreen from "@screens/auth/signup";
import { $sessionStore } from "@context/sessionStore";
import { colors } from "@theme";

const AuthStack = createNativeStackNavigator<AuthParamList>();

export default function RootContainer() {
  const { connected } = useUnit($sessionStore);

  useEffect(() => {
    console.log("CONNECTED:", connected);
  }, [connected]);

  return (
    <NavigationContainer>
      {connected ? (
        <TabBarContainer />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            statusBarTranslucent: true,
            headerTintColor: colors.white,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: colors.primary },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: colors.secondary,
            },
          }}
        >
          <AuthStack.Screen
            name="login"
            component={LoginScreen}
            options={{ title: "Connexion" }}
          />
          <AuthStack.Screen
            name="signup"
            component={SignupScreen}
            options={{ title: "Inscription" }}
          />
          <AuthStack.Screen name="forgotPassword" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
