import styled from "styled-components/native";
import { windowScale } from "data";
import { colors, fontSize } from "@theme";

export const Text = styled.Text<{
  $size?: keyof typeof fontSize;
  $dark?: boolean;
  $bold?: boolean;
}>`
  font-size: ${(props) =>
    props.$size
      ? fontSize[props.$size as keyof typeof fontSize]
      : fontSize.m}px;
  color: ${(props) => (props.$dark ? colors.primary : colors.white)};
  font-weight: ${(props) => (props.$bold ? "bold" : "normal")};
`;

export const Link = styled(Text)`
  color: ${colors.cyan};
`;

export const Title1 = styled(Text)`
  font-size: ${fontSize.xl}px;
`;

export const Title2 = styled(Text)`
  font-size: ${fontSize.l}px;
`;

export const Body = styled.View`
  margin: 0px 15px 10px;
  row-gap: 15px;
`;

export const Container = styled.View`
  flex: 1;
`;

export const ContainerScroll = styled.ScrollView`
  flex: 1;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Image = styled.Image<{ $size?: number }>`
  width: ${(props) => props.$size || windowScale.width}px;
  aspect-ratio: 1;
`;
