import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, MD3Colors } from "react-native-paper";
import { FieldValues } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Container, Row, Text } from "@styledComponents";
import { FieldInputProps } from "utils/formUtils";
import { colors } from "@theme";

export function ImagePickerForm<T extends FieldValues>({
  field: { value, onChange },
  label,
}: FieldInputProps<T>) {
  console.log({ value });
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
            console.log("OUIIIIIII");
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
        {label} :
      </Text>
      <Row style={styles.btnContainer}>
        <TouchableOpacity
          onPress={pickImageFromLibrary}
          style={{
            borderColor: colors.primary,
            borderRadius: 5,
            borderWidth: 1,
            padding: 10,
          }}
        >
          <Text $dark>Choisir dans la galerie</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImageFromCamera}
          style={{
            borderColor: colors.primary,
            borderRadius: 5,
            borderWidth: 1,
            padding: 10,
          }}
        >
          <Text $dark>Prendre photo</Text>
        </TouchableOpacity>
      </Row>
      {image && (
        <View>
          <IconButton
            icon="delete-circle"
            size={40}
            iconColor={MD3Colors.error50}
            style={{ position: "absolute", right: 0, zIndex: 10 }}
            onPress={deletePickChoice}
          />
          <Image source={{ uri: image }} style={styles.image} />
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
