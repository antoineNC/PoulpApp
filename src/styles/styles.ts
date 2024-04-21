import { windowScale } from "data";
import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    rowGap: 50,
    justifyContent: "flex-start",
    marginTop: 50,
  },
  formList: {
    rowGap: 10,
  },
  buttonContainer: {
    rowGap: 20,
  },
  formField: {
    width: windowScale.width * 0.8,
  },
});
