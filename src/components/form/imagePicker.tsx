import { useState } from "react";
import { Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Row } from "@styledComponents";
import { Button } from "react-native-paper";
import { colors } from "@theme";
import { FieldInputProps } from "utils/formUtils";
import { FieldValues } from "react-hook-form";

export function ImagePickerForm<T extends FieldValues>({
  field: { value, onChange },
  label,
}: FieldInputProps<T>) {
  const image = value;

  const pickImageFromLibrary = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      //   setImage(result.assets[0].uri);
      onChange(result.assets[0].uri);
    }
  };
  const pickImageFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      //   setImage(result.assets[0].uri);
      onChange(result.assets[0].uri);
    }
  };

  return (
    <Row style={styles.container}>
      <Button
        mode="contained"
        children="Pick from camera roll"
        onPress={pickImageFromLibrary}
        uppercase
        buttonColor={colors.primary}
      />
      <Button
        mode="contained"
        children="Take picture"
        onPress={pickImageFromCamera}
        uppercase
        buttonColor={colors.primary}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </Row>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  image: {
    width: 200,
    height: 200,
  },
});
