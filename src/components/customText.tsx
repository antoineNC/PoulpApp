import { Text, useTheme, TextProps } from "react-native-paper";
import { Text as RNText } from "react-native";

export function NativeText(props: TextProps<Text>) {
  return <RNText {...props} />;
}

export function BodyText(props: TextProps<Text>) {
  return <Text {...props} variant="bodyMedium" />;
}

export function LinkText(props: TextProps<Text>) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      variant="bodyMedium"
      style={[props.style, { color: colors.tertiary }]}
    />
  );
}

export function LabelText(props: TextProps<Text>) {
  return <Text {...props} variant="bodySmall" />;
}

export function Title2Text(props: TextProps<Text>) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      variant="bodyLarge"
      style={[props.style, { color: colors.primary }]}
    />
  );
}

export function TitleText(props: TextProps<Text>) {
  return <Text {...props} variant="titleMedium" />;
}

export function HeaderText(props: TextProps<Text>) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      variant="titleLarge"
      style={[props.style, { color: colors.primary }]}
    />
  );
}
