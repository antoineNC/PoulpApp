import { SessionContext } from "@context/session/sessionContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import HomeScreen from "@screens/home";
import LoginScreen from "@screens/login";

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
  });
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session.connected ? (
          <>
            <Stack.Screen name="login" component={LoginScreen} />
            {/* <Stack.Screen name="signup" component={} />
            <Stack.Screen name="forgotPassword" component={} /> */}
          </>
        ) : (
          <>
            <Stack.Screen name="home" component={HomeScreen} />
            {/* <Stack.Screen name="office" component={} />
            <Stack.Screen name="famCup" component={} />
            <Stack.Screen name="menu" component={} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
