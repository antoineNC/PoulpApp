import ContextProvider from "@context/index";
import RootContainer from "navigation/rootContainer";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <ContextProvider>
        <RootContainer />
      </ContextProvider>
    </SafeAreaProvider>
  );
}
