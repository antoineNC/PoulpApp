import { Text, useTheme } from "react-native-paper";
import { RNTextProps } from "types/text.type";

export function BodyText(props: RNTextProps) {
  return <Text {...props} variant="bodyMedium" />;
}

export function LinkText(props: RNTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      variant="bodyMedium"
      style={[props.style, { color: colors.primary }]}
    />
  );
}

export function LabelText(props: RNTextProps) {
  return <Text {...props} variant="labelLarge" />;
}

export function TitleText(props: RNTextProps) {
  return <Text {...props} variant="titleMedium" />;
}

export function HeaderText(props: RNTextProps) {
  return <Text {...props} variant="titleLarge" />;
}
