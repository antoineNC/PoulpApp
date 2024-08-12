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
  font-weight: bold;
  padding: 0 10px;
`;

export const BodyTitle = styled(Text)`
  font-weight: 900;
  margin: 5px 0;
`;

export const Body = styled.View`
  margin: 10px 15px;
  row-gap: 15px;
`;

export const Container = styled.View`
  flex: 1;
`;

export const ContainerScroll = styled.ScrollView`
  flex: 1;
`;

export const Row = styled.View<{ $padding?: string; $justify?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.$justify || "start"};
  padding: ${(props) => props.$padding || "0px"};
`;

export const Image = styled.Image<{ $size?: number }>`
  width: ${(props) => props.$size || windowScale.width}px;
  aspect-ratio: 1;
`;

export const ModalContainer = styled.View`
  flex: 1;
  background-color: ${colors.primary};
  padding: 15px 0 0;
`;
