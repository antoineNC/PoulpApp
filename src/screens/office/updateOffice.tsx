import { useState } from "react";
import { FlatList, View, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useStoreMap } from "effector-react";
import { AnimatedFAB, IconButton } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";

import { useClub, useOffice, usePartnership } from "@firebaseApi";
import { UpdateOfficeProps } from "@navigation/navigationTypes";
import { $officeStore } from "@context/officeStore";
import { OfficeFieldNames } from "@types";
import { authStyles, officeStyles } from "@styles";
import { ContainerScroll, Text } from "@styledComponents";
import { colors } from "@theme";
import { TextInputForm } from "components/form/textInput";
import { ImagePickerForm } from "components/form/imagePicker";
import { SmallCardItem } from "components/smallCardItem";
import ListMemberForm from "../../components/listMemberForm";
import { useRight } from "utils/rights";
import { FloatingValidateBtn } from "components/validateButton";

export default function UpdateOfficeScreen({
  navigation,
  route,
}: UpdateOfficeProps) {
  const { officeId } = route.params;
  const [loading, setLoading] = useState(false);
  const { updateOffice } = useOffice();
  const { deleteClub } = useClub();
  const { deletePartnership } = usePartnership();
  const { hasRight } = useRight();
  const office = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === officeId),
  });

  if (!office) {
    return <></>;
  }

  const [clubs, partnerships] = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) => {
      const clubs = officeStore.clubList.filter(
        (club) => club.officeId === office.id
      );
      const partnerships = officeStore.partnershipList.filter(
        (partnership) => partnership.officeId === office.id
      );
      return [clubs, partnerships];
    },
  });

  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
    register,
  } = useForm<OfficeFieldNames>({
    defaultValues: { ...office, logoFile: office.logoUrl },
  });

  const onSubmit = async (data: OfficeFieldNames) => {
    try {
      setLoading(true);
      await updateOffice({ ...data }, office.id);
    } catch (e) {
      console.log("[updateoffice]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  const onDeleteClub = async (id: string) => await deleteClub(id);

  const onDeletePartnership = async (id: string) => await deletePartnership(id);
  return (
    <>
      <ContainerScroll>
        {loading && (
          <Spinner
            visible={loading}
            textContent={"Modification..."}
            textStyle={{ color: colors.white }}
          />
        )}
        <View style={[authStyles.formList, officeStyles.container]}>
          <Controller
            control={control}
            name="acronym"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextInputForm
                field={field}
                fieldState={fieldState}
                label="Acronyme *"
                index={0}
                lastInput={false}
                setFocus={() => setFocus("name")}
                type="text"
                submit={handleSubmit(onSubmit)}
              />
            )}
          />
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextInputForm
                field={field}
                fieldState={fieldState}
                label="Nom *"
                index={1}
                lastInput={false}
                setFocus={() => setFocus("description")}
                type="text"
                submit={handleSubmit(onSubmit)}
              />
            )}
          />
          <Controller
            control={control}
            name="mail"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextInputForm
                field={field}
                fieldState={fieldState}
                label="E-mail *"
                index={2}
                lastInput={false}
                setFocus={() => setFocus("description")}
                type="text"
                submit={handleSubmit(onSubmit)}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <TextInputForm
                field={field}
                fieldState={fieldState}
                type="text"
                label="Description"
                index={3}
                lastInput={false}
                options={{ multiline: true }}
                setFocus={() => setFocus("logoFile")}
                submit={handleSubmit(onSubmit)}
              />
            )}
          />
          <Controller
            control={control}
            name="logoFile"
            render={({ field, fieldState }) => (
              <ImagePickerForm
                field={field}
                fieldState={fieldState}
                label="Logo :"
                index={4}
                lastInput={false}
                setFocus={() => setFocus("members")}
                type="image"
                submit={handleSubmit(onSubmit)}
              />
            )}
          />
          {/* TODO : gérer le display des clubs plus proprement */}
          {office.acronym !== "I2C" && (
            <>
              <Text $bold $dark>
                Les clubs :
              </Text>
              <View style={{ marginHorizontal: -15 }}>
                <FlatList
                  horizontal
                  data={clubs}
                  contentContainerStyle={{
                    columnGap: 10,
                    padding: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  ListHeaderComponentStyle={{ justifyContent: "center" }}
                  ListHeaderComponent={
                    <IconButton
                      icon="plus"
                      mode="contained"
                      size={40}
                      style={{ borderRadius: 5 }}
                      onPress={() =>
                        navigation.navigate("createClub", { officeId })
                      }
                    />
                  }
                  renderItem={({ item }) => {
                    return (
                      <SmallCardItem
                        title={item.name}
                        logo={item.logoUrl}
                        onEdit={() =>
                          navigation.navigate("updateClub", { clubId: item.id })
                        }
                        onDelete={() =>
                          Alert.alert(
                            "Supprimer un club",
                            "Voulez-vous vraiment supprimer définitivement ce club ?",
                            [
                              {
                                text: "OUI",
                                onPress: () => onDeleteClub(item.id),
                              },
                              { text: "NON" },
                            ]
                          )
                        }
                      />
                    );
                  }}
                />
              </View>
            </>
          )}
          <Text $bold $dark>
            Les partenariats :
          </Text>
          <View style={{ marginHorizontal: -15 }}>
            <FlatList
              horizontal
              data={partnerships}
              contentContainerStyle={{ columnGap: 10, padding: 10 }}
              showsHorizontalScrollIndicator={false}
              ListHeaderComponentStyle={{ justifyContent: "center" }}
              ListHeaderComponent={
                <IconButton
                  icon="plus"
                  mode="contained"
                  size={40}
                  style={{ borderRadius: 5 }}
                  onPress={() =>
                    navigation.navigate("createPartnership", { officeId })
                  }
                />
              }
              renderItem={({ item }) => {
                return (
                  <SmallCardItem
                    title={item.name}
                    logo={item.logoUrl}
                    onEdit={() =>
                      navigation.navigate("updatePartnership", {
                        partnershipId: item.id,
                      })
                    }
                    onDelete={() =>
                      Alert.alert(
                        "Supprimer un partenariat",
                        "Voulez-vous vraiment supprimer définitivement ce partenariat ?",
                        [
                          {
                            text: "OUI",
                            onPress: () => onDeletePartnership(item.id),
                          },
                          { text: "NON" },
                        ]
                      )
                    }
                  />
                );
              }}
            />
          </View>
          <ListMemberForm
            control={control}
            setValue={setValue}
            register={register}
            errors={errors}
          />
        </View>
        <View style={{ height: 100 }} />
      </ContainerScroll>
      <FloatingValidateBtn
        label="Enregistrer les informations du bureau"
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
}
