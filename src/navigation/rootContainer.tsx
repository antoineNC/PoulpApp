import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUnit } from "effector-react";

import TabBarContainer from "@navigation/tabBarContainer";
import { AuthParamList } from "@navigation/navigation.types";
import LoginScreen from "@screens/auth/login";
import SignupScreen from "@screens/auth/signup";
import { $sessionStore } from "store/sessionStore";

const AuthStack = createNativeStackNavigator<AuthParamList>();

export default function RootContainer() {
  const connected = useUnit($sessionStore);
  console.log("CONNECTED:", connected);
  return (
    <NavigationContainer>
      {connected ? (
        <TabBarContainer />
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="login" component={LoginScreen} />
          <AuthStack.Screen name="signup" component={SignupScreen} />
          <AuthStack.Screen name="forgotPassword" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
