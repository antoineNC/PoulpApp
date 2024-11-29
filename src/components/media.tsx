import { Image } from "@styledComponents";
import { ImageProps } from "react-native";

type MediaProps = ImageProps & {
  sourceUri?: string;
  size?: number;
};

export const Media = ({ sourceUri, size, style, ...rest }: MediaProps) => {
  return (
    <Image
      {...rest}
      $size={size}
      style={[style, { height: size || "auto", width: size || "auto" }]}
      source={
        sourceUri
          ? { uri: sourceUri }
          : require("@assets/no_image_available.png")
      }
    />
  );
};
