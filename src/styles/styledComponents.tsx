import { windowScale } from "data";
import styled from "styled-components/native";
import { colors, fontSize } from "@theme";

export const Text = styled.Text<{ $size?: string }>`
  color: ${colors.white};
  font-size: ${(props) =>
    props.$size
      ? fontSize[props.$size as keyof typeof fontSize]
      : fontSize.m}px;
`;

export const Title = styled(Text)`
  font-size: ${fontSize.l}px;
`;

export const Body = styled(Text)`
  margin: 0px 15px 10px;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Image = styled.Image<{ $size?: number }>`
  width: ${(props) => props.$size || windowScale.width}px;
  aspect-ratio: 1;
`;
