import styled from "styled-components/native";
import { windowScale } from "data";

export const Body = styled.View`
  flex: 1;
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
