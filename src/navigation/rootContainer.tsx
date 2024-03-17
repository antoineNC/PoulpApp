import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUnit } from "effector-react";

import TabBarContainer from "@navigation/tabBarContainer";
import LoginScreen from "@screens/auth/login";
import { $sessionStore } from "store/sessionStore";

const Stack = createNativeStackNavigator();

export default function RootContainer() {
  const connected = useUnit($sessionStore);
  return (
    <NavigationContainer>
      {connected ? (
        <TabBarContainer />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="signup" component={LoginScreen} />
          <Stack.Screen name="forgotPassword" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
