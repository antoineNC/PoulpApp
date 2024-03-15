import { SessionContext } from "@context/session/sessionContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import LoginScreen from "@screens/auth/login";
import TabBarContainer from "@navigation/tabBarContainer";

const Stack = createNativeStackNavigator();

export default function RootContainer() {
  const { session, setSession } = useContext(SessionContext);
  const token = true;
  useEffect(() => {
    if (token) {
      // const user = getUser();
      setSession({
        type: "RESTORE_TOKEN",
        session: {
          token: "token",
          user: {
            id: "admin",
            mail: "admin@mail.com",
            access: "ALL",
            infos: { name: "admin" },
          },
        },
      });
    }
  }, []);
  return (
    <NavigationContainer>
      {session.connected ? (
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
