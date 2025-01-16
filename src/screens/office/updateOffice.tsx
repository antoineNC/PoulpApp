import React, { useState } from "react";
import { FlatList, View, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useStoreMap } from "effector-react";
import { IconButton, useTheme } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";

import { updateOffice } from "@fb/service/office.service";
import { deleteClub } from "@fb/service/club.service";
import { deletePartnership } from "@fb/service/partnership.service";
import { UpdateOfficeProps } from "@navigation/navigationTypes";
import { $officeStore } from "@context/officeStore";
import { OfficeFormFields } from "types/office.type";
import { TextInputForm } from "components/form/textInput";
import { ImagePickerForm } from "components/form/imagePicker";
import { SmallCardItem } from "components/smallCardItem";
import ListMemberForm from "components/form/listMemberForm";
import { FloatingValidateBtn } from "components/validateButton";
import { BodyText } from "components/customText";
import { authStyles, officeStyles } from "@styles";
import { ContainerScroll } from "@styledComponents";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

export default function UpdateOfficeScreen({
  navigation,
  route,
}: UpdateOfficeProps) {
  const { officeId } = route.params;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const office = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === officeId),
  });
  const [clubs, partnerships] = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) => {
      const clubs = officeStore.clubList.filter(
        (club) => club.officeId === office?.id
      );
      const partnerships = officeStore.partnershipList.filter(
        (partnership) => partnership.officeId === office?.id
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
  } = useForm<OfficeFormFields>({
    defaultValues: { ...office, logoFile: office?.logoUrl },
  });

  if (!office) {
    return <></>;
  }

  const onSubmit = async (data: OfficeFormFields) => {
    try {
      setLoading(true);
      await updateOffice(data, office.id);
      notificationToast("success", "Bureau mis à jour.");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  const onDeleteClub = async (id: string) => {
    Alert.alert(
      "Supprimer un club",
      "Voulez-vous vraiment supprimer définitivement ce club ?",
      [
        {
          text: "OUI",
          onPress: async () => {
            await deleteClub(id);
            notificationToast("success", "Club supprimé.");
          },
        },
        { text: "NON" },
      ]
    );
  };

  const onDeletePartnership = async (id: string) => {
    Alert.alert(
      "Supprimer un partenariat",
      "Voulez-vous vraiment supprimer définitivement ce partenariat ?",
      [
        {
          text: "OUI",
          onPress: async () => {
            await deletePartnership(id);
            notificationToast("success", "Partenariat supprimé.");
          },
        },
        { text: "NON" },
      ]
    );
  };
  return (
    <>
      <ContainerScroll>
        {loading && (
          <Spinner
            visible={loading}
            textContent={"Modification..."}
            textStyle={{ color: colors.onBackground }}
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
                submit={handleSubmit(onSubmit)}
              />
            )}
          />
          {office.acronym !== "I2C" && (
            <View style={{ paddingVertical: 10 }}>
              <BodyText>Les clubs :</BodyText>
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
                        onDelete={() => onDeleteClub(item.id)}
                      />
                    );
                  }}
                />
              </View>
            </View>
          )}
          <View style={{ paddingVertical: 10 }}>
            <BodyText>Les partenariats :</BodyText>
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
                      onDelete={() => onDeletePartnership(item.id)}
                    />
                  );
                }}
              />
            </View>
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
        label="Enregistrer le bureau"
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
}
