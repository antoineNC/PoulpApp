import ContextProvider from "@context/index";
import RootContainer from "navigation/rootContainer";

export default function App() {
  return (
    <ContextProvider>
      <RootContainer />
    </ContextProvider>
  );
}
