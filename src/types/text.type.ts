import { JSX } from "react";
import { TextProps, StyleProp, TextStyle } from "react-native";
import { TextRef } from "react-native-paper/lib/typescript/components/Typography/Text";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

export type RNTextProps = JSX.IntrinsicAttributes &
  TextProps & {
    variant?: VariantProp<never> | undefined;
    children: React.ReactNode;
    theme?: ThemeProp;
    style?: StyleProp<TextStyle>;
  } & { ref?: React.RefObject<TextRef> };
