import { useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, IconButton, MD3Colors } from "react-native-paper";
import { FieldValues } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import ImageView from "react-native-image-viewing";
import { Container, Row, Text } from "@styledComponents";
import { FieldInputProps } from "types/form.type";
import { colors } from "@theme";

export function ImagePickerForm<T extends FieldValues>({
  field: { value, onChange },
  label,
}: FieldInputProps<T>) {
  const image = value;
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
      <Text $dark $bold>
        {label}
      </Text>
      {image && (
        <View>
          <IconButton
            icon="delete-circle"
            size={40}
            // iconColor={MD3Colors.error50}
            style={{ position: "absolute", right: 0, zIndex: 10 }}
            onPress={deletePickChoice}
          />
          <TouchableOpacity onPress={() => setShowImage(true)}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
          <ImageView
            images={[{ uri: image }]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => setShowImage(false)}
          />
        </View>
      )}
      <Row style={styles.btnContainer}>
        <Button
          mode="outlined"
          // textColor={colors.primary}
          onPress={pickImageFromLibrary}
          icon={"folder-image"}
          style={{ borderRadius: 5 }}
        >
          Choisir dans la galerie
        </Button>
        <Button
          mode="outlined"
          // textColor={colors.primary}
          onPress={pickImageFromCamera}
          icon={"camera"}
          style={{ borderRadius: 5 }}
        >
          Prendre photo
        </Button>
      </Row>
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
