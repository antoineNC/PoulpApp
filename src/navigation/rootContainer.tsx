import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUnit } from "effector-react";

import TabBarContainer from "@navigation/tabBarContainer";
import { AuthParamList } from "@navigation/navigationTypes";
import LoginScreen from "@screens/auth/login";
import RegisterScreen from "@screens/auth/register";
import { $sessionStore } from "@context/sessionStore";
import { useTheme } from "react-native-paper";
import ForgotPasswordScreen from "@screens/auth/forgotPassword";

const AuthStack = createNativeStackNavigator<AuthParamList>();

export default function RootContainer({ theme }: { theme: Theme }) {
  const { connected } = useUnit($sessionStore);
  const { colors } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      {connected ? (
        <TabBarContainer />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            statusBarTranslucent: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        >
          <AuthStack.Screen
            name="login"
            component={LoginScreen}
            options={{ title: "Connexion" }}
          />
          <AuthStack.Screen
            name="signup"
            component={RegisterScreen}
            options={{ title: "Inscription" }}
          />
          <AuthStack.Screen
            name="forgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: "Mot de passe oublié" }}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
