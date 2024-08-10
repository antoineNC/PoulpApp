import { colors } from "@theme";
import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginHorizontal: 40,
  },
  formList: {
    rowGap: 10,
  },
  buttonContainer: {
    marginVertical: 40,
    rowGap: 20,
  },
});

export const officeStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  borderRounded: {
    borderWidth: 0.5,
    borderColor: colors.secondary,
    borderRadius: 5,
    padding: 5,
    marginVertical: 10,
  },
});
