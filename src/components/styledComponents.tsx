import styled from "styled-components/native";
import { colors, fontSize } from "theme";

export const Text = styled.Text<{ $size?: string }>`
  color: ${colors.white};
  font-size: ${(props) =>
    props.$size
      ? fontSize[props.$size as keyof typeof fontSize]
      : fontSize.m}px;
`;

const StyledText = styled.Text`
  color: #bf4f74;
`;
