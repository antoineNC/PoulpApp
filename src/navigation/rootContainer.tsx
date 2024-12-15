import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUnit } from "effector-react";

import TabBarContainer from "@navigation/tabBarContainer";
import { AuthParamList } from "@navigation/navigationTypes";
import LoginScreen from "@screens/auth/login";
import SignupScreen from "@screens/auth/signup";
import { $sessionStore } from "@context/sessionStore";
import { colors } from "@theme";

const AuthStack = createNativeStackNavigator<AuthParamList>();

export default function RootContainer({ theme }: { theme: Theme }) {
  const { connected } = useUnit($sessionStore);

  return (
    <NavigationContainer theme={theme}>
      {connected ? (
        <TabBarContainer />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            statusBarTranslucent: true,
            // headerTintColor: colors.white,
            headerTitleAlign: "center",
            // headerStyle: { backgroundColor: colors.primary },
            headerShadowVisible: false,
            contentStyle: {
              // backgroundColor: colors.secondary,
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
