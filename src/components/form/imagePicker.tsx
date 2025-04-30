import { useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { FieldValues } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import ImageView from "react-native-image-viewing";

import { Container, Row } from "@styledComponents";
import { InputProps } from "types/form.type";
import { BodyText } from "components/customText";
import { camera, gallery, trash } from "components/icon/icons";

export function ImagePickerForm<T extends FieldValues>({
  field: { value, onChange },
  label,
}: InputProps<T>) {
  const image = value;
  const { colors } = useTheme();
  const [showImage, setShowImage] = useState(false);
  const pickImageFromLibrary = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
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
    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };
  const deletePickChoice = () => {
    Alert.alert(
      "Supprimer image",
      "Voulez-vous vraiment supprimer cette image ?",
      [
        {
          text: "Oui",
          onPress: () => {
            onChange("");
          },
        },
        { text: "Non" },
      ],
      { cancelable: true }
    );
  };

  return (
    <Container style={styles.container}>
      <BodyText>{label}</BodyText>
      <Row style={styles.btnContainer}>
        <Button
          mode="contained-tonal"
          onPress={pickImageFromLibrary}
          icon={gallery}
        >
          Choisir dans la galerie
        </Button>
        <Button
          mode="contained-tonal"
          onPress={pickImageFromCamera}
          icon={camera}
        >
          Prendre photo
        </Button>
      </Row>
      {image && (
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity onPress={() => setShowImage(true)}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
          <Button
            icon={trash}
            onPress={deletePickChoice}
            style={{ marginVertical: 10 }}
            buttonColor={colors.errorContainer}
            textColor={colors.onBackground}
          >
            Supprimer l'image
          </Button>
          <ImageView
            images={[{ uri: image }]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => setShowImage(false)}
          />
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
