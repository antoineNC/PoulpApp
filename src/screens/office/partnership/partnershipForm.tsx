import { KeyboardAvoidingView, Platform, View } from "react-native";
import { IconButton, TextInput, useTheme } from "react-native-paper";
import { ContainerScroll } from "@styledComponents";
import { authStyles, officeStyles } from "@styles";
import CustomField from "components/form/formField";
import Spinner from "react-native-loading-spinner-overlay";
import {
  DefaultValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FloatingValidateBtn } from "components/validateButton";
import { PartnershipFormFields } from "types/partnership.type";
import { FieldParams } from "types/form.type";
import { BodyText } from "components/customText";

const PartnershipForm = ({
  create,
  loading,
  fieldItems,
  defaultValues,
  onSubmit,
}: {
  create: boolean;
  loading: boolean;
  fieldItems: FieldParams<PartnershipFormFields>[];
  defaultValues: DefaultValues<PartnershipFormFields>;
  onSubmit: SubmitHandler<PartnershipFormFields>;
}) => {
  const loaderTxt = create ? "Création..." : "Modification...";
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: { errors },
    setValue,
  } = useForm<PartnershipFormFields>({
    defaultValues: defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ContainerScroll style={officeStyles.container}>
        {loading && (
          <Spinner
            visible={loading}
            textContent={loaderTxt}
            textStyle={{ color: colors.onBackground }}
          />
        )}
        <View style={authStyles.formList}>
          {fieldItems.map((field, index) => (
            <CustomField<PartnershipFormFields>
              {...field}
              key={index}
              control={control}
              index={index}
              lastInput={index === fieldItems.length - 1}
              setFocus={(index) =>
                index < fieldItems.length && setFocus(fieldItems[index].name)
              }
              submit={handleSubmit(onSubmit)}
            />
          ))}
          <View style={{ paddingVertical: 10 }}>
            <BodyText>Les avantages :</BodyText>
          </View>
          {fields.map((benefit, index) => (
            <View key={benefit.id}>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  mode="outlined"
                  style={{
                    flex: 1,
                  }}
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
                  mode="contained"
                  iconColor={colors.error}
                  onPress={() => remove(index)}
                />
              </View>
            </View>
          ))}
          <IconButton
            icon={"plus"}
            mode="outlined"
            style={{ width: "auto" }}
            onPress={() => append({ value: "" })}
          />
        </View>
        <View style={{ height: 100 }} />
      </ContainerScroll>
      <FloatingValidateBtn
        label="Enregistrer le partenariat"
        onPress={handleSubmit(onSubmit)}
      />
    </KeyboardAvoidingView>
  );
};
export default PartnershipForm;
