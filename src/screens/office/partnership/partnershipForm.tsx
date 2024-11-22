import { KeyboardAvoidingView, Platform, View } from "react-native";
import {
  HelperText,
  IconButton,
  MD3Colors,
  TextInput,
} from "react-native-paper";
import { ContainerScroll, Text } from "@styledComponents";
import { authStyles, officeStyles } from "@styles";
import { colors } from "@theme";
import { FormFieldValues, PartnershipFieldNames } from "@types";
import CustomField from "components/form/formField";
import Spinner from "react-native-loading-spinner-overlay";
import {
  DefaultValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FloatingValidateBtn } from "components/validateButton";

const PartnershipForm = ({
  create,
  loading,
  fieldItems,
  defaultValues,
  onSubmit,
}: {
  create: boolean;
  loading: boolean;
  fieldItems: FormFieldValues<PartnershipFieldNames>;
  defaultValues: DefaultValues<PartnershipFieldNames>;
  onSubmit: SubmitHandler<PartnershipFieldNames>;
}) => {
  const loaderTxt = create ? "Création..." : "Modification...";
  const {
    control,
    handleSubmit,
    setFocus,
    register,
    formState: { errors },
    setValue,
  } = useForm<PartnershipFieldNames>({
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
            textStyle={{ color: colors.white }}
          />
        )}
        <View style={authStyles.formList}>
          {fieldItems.map((field, index) => (
            <CustomField<PartnershipFieldNames>
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
      <FloatingValidateBtn
        label="Enregistrer le partenariat"
        onPress={handleSubmit(onSubmit)}
      />
    </KeyboardAvoidingView>
  );
};
export default PartnershipForm;
