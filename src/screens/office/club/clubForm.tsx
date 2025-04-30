import React from "react";
import { View } from "react-native";
import { Control, UseFormSetFocus } from "react-hook-form";
import Spinner from "react-native-loading-spinner-overlay";
import { useTheme } from "react-native-paper";
import { ContainerScroll } from "@styledComponents";
import { authStyles, officeStyles } from "@styles";
import CustomField from "components/form/formField";
import { FloatingValidateBtn } from "components/validateButton";
import { ClubFormFields } from "types/club.type";
import { FieldParams } from "types/form.type";

// TODO : move to components
const ClubForm = ({
  create,
  loading,
  control,
  values,
  onSubmit,
  setFocus,
}: {
  create: boolean;
  loading: boolean;
  control: Control<ClubFormFields>;
  values: FieldParams<ClubFormFields>[];
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  setFocus: UseFormSetFocus<ClubFormFields>;
}) => {
  const { colors } = useTheme();
  const loaderTxt = create ? "Création..." : "Modification...";
  return (
    <>
      <ContainerScroll style={officeStyles.container}>
        {loading && (
          <Spinner
            visible={loading}
            textContent={loaderTxt}
            textStyle={{ color: colors.onBackground }}
          />
        )}
        <View style={authStyles.formList}>
          {values.map((field, index) => (
            <CustomField<ClubFormFields>
              {...field}
              key={index}
              control={control}
              index={index}
              lastInput={index === values.length - 1}
              setFocus={(index) =>
                index < values.length && setFocus(values[index].name)
              }
              submit={onSubmit}
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ContainerScroll>
      <FloatingValidateBtn label="Enregistrer le club" onPress={onSubmit} />
    </>
  );
};

export default ClubForm;
