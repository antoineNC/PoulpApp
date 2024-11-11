import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useStoreMap, useUnit } from "effector-react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  AnimatedFAB,
  HelperText,
  IconButton,
  MD3Colors,
  TextInput,
} from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";

import { $officeStore } from "@context/officeStore";
import { UpdatePartnershipProps } from "@navigation/navigationTypes";
import { FormFieldValues, PartnershipFieldNames } from "@types";
import { colors } from "@theme";
import { authStyles, officeStyles } from "@styles";
import { ContainerScroll, Text } from "@styledComponents";
import CustomField from "components/form/formField";
import { $sessionStore } from "@context/sessionStore";

export default function UpdatePartnershipScreen({
  navigation,
  route,
}: UpdatePartnershipProps) {
  const { partnershipId } = route.params;
  //   const { updatePartnership } = useOffice();
  const { officeList } = useUnit($officeStore);
  const { role } = useUnit($sessionStore);
  const [loading, setLoading] = useState(false);
  const partnership = useStoreMap({
    store: $officeStore,
    keys: [partnershipId],
    fn: (officeStore) =>
      officeStore.partnershipList.find(
        (partner) => partner.id === partnershipId
      ),
  });
  if (!partnership) {
    return <></>;
  }
  const office = useStoreMap({
    store: $officeStore,
    keys: [partnershipId],
    fn: (officeStore) =>
      officeStore.officeList.find(
        (office) => office.id === partnership.officeId
      ),
  });
  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: { errors },
    setValue,
  } = useForm<PartnershipFieldNames>({
    defaultValues: {
      ...partnership,
      office: { label: office?.name, value: office?.id },
      logoFile: partnership.logoUrl,
      benefits: partnership.benefits?.map((val) => ({
        value: val,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
    rules: {},
  });

  const values: FormFieldValues<PartnershipFieldNames> = [
    {
      name: "name",
      label: "Nom",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      options: { multiline: true },
    },
    {
      name: "address",
      label: "Adresse",
      type: "text",
    },
    {
      name: "addressMap",
      label: "Adresse (lien)",
      type: "text",
    },
    {
      name: "logoFile",
      label: "Logo :",
      type: "image",
    },
  ];

  if (role === "ADMIN_ROLE") {
    values.unshift({
      name: "office",
      label: "Géré par",
      type: "select",
      options: { choices: officeChoices },
    });
  }

  const onSubmit = async (data: PartnershipFieldNames) => {
    try {
      setLoading(true);
      //   await updatePartnership({ ...data }, partnershipId);
    } catch (e) {
      console.error("[updatepost]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ContainerScroll style={officeStyles.container}>
        {loading && (
          <Spinner
            visible={loading}
            textContent={"Modification..."}
            textStyle={{ color: colors.white }}
          />
        )}
        <View style={authStyles.formList}>
          {values.map((field, index) => (
            <CustomField<PartnershipFieldNames>
              {...field}
              key={index}
              control={control}
              index={index}
              lastInput={index === values.length - 1}
              setFocus={(index) =>
                index < values.length && setFocus(values[index].name)
              }
              submit={handleSubmit(onSubmit)}
            />
          ))}
          <View style={{ paddingVertical: 20 }}>
            <Text $bold $dark>
              Les avantages :
            </Text>
          </View>
          {fields.map((benefit, index) => (
            <View key={benefit.id}>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  mode="outlined"
                  style={{ flex: 1, backgroundColor: colors.secondary }}
                  error={
                    errors?.benefits?.[index]?.value?.message !== undefined
                  }
                  placeholder="Avantage"
                  {...register(`benefits.${index}.value` as const, {
                    validate: (benefit) => {
                      return benefit !== "" || "Ne peut pas être vide";
                    },
                  })}
                  onChangeText={(e) => setValue(`benefits.${index}.value`, e)}
                  defaultValue={benefit.value}
                />
                <IconButton
                  icon={"window-close"}
                  mode="outlined"
                  iconColor={MD3Colors.error50}
                  onPress={() => remove(index)}
                />
              </View>
              {errors && (
                <HelperText type="error">
                  {errors?.benefits?.[index]?.value?.message}
                </HelperText>
              )}
            </View>
          ))}
          <IconButton
            icon={"plus"}
            mode="outlined"
            style={{ width: "auto", borderRadius: 5 }}
            onPress={() => append({ value: "" })}
          />
        </View>
        <View style={{ height: 100 }} />
      </ContainerScroll>
      <AnimatedFAB
        icon={"content-save"}
        label={"Enregistrer le partenariat"}
        extended={true}
        onPress={handleSubmit(onSubmit)}
        visible={true}
        animateFrom="right"
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
        }}
        variant="secondary"
      />
    </KeyboardAvoidingView>
  );
}
