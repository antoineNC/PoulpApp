import { ContainerScroll } from "@styledComponents";
import { authStyles, officeStyles } from "@styles";
import { colors } from "@theme";
import { ClubFieldNames, FormFieldValues } from "@types";
import CustomField from "components/form/formField";
import { FloatingValidateBtn } from "components/validateButton";
import { Control, UseFormSetFocus } from "react-hook-form";
import { View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

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
  control: Control<ClubFieldNames>;
  values: FormFieldValues<ClubFieldNames>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  setFocus: UseFormSetFocus<ClubFieldNames>;
}) => {
  const loaderTxt = create ? "Création..." : "Modification...";
  return (
    <>
      <ContainerScroll style={officeStyles.container}>
        {loading && (
          <Spinner
            visible={loading}
            textContent={loaderTxt}
            textStyle={{ color: colors.white }}
          />
        )}
        <View style={authStyles.formList}>
          {values.map((field, index) => (
            <CustomField<ClubFieldNames>
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
