import { View, StyleSheet } from "react-native";
import { useUnit } from "effector-react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { HelperText, IconButton, useTheme } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";

import { $officeStore } from "@context/officeStore";
import { $studentStore } from "@context/studentStore";
import { Container } from "@styledComponents";
import { OfficeFormFields, RoleOffice } from "types/office.type";
import { Student } from "types/student.type";
import { BodyText } from "./customText";

export default function ListMemberForm({
  control,
  setValue,
  register,
  errors,
}: {
  control: Control<OfficeFormFields>;
  setValue: UseFormSetValue<OfficeFormFields>;
  register: UseFormRegister<OfficeFormFields>;
  errors: FieldErrors<OfficeFormFields>;
}) {
  const studentList = useUnit($studentStore);
  const { roleList } = useUnit($officeStore);
  const { colors, roundness } = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
    rules: {
      validate: (members) => {
        const member = members.find(
          (member) => member.idRole === "" || member.idStudent === ""
        );
        return !member || "Tous les champs doivent être remplis";
      },
    },
  });
  return (
    <Container>
      <View style={{ paddingVertical: 10 }}>
        <BodyText>Les membres :</BodyText>
      </View>
      <View>
        {fields.map((member, index) => (
          <View key={member.id}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1, rowGap: 5 }}>
                <Dropdown<RoleOffice>
                  {...register(`members.${index}.idRole` as const, {
                    validate: (role) => {
                      return role !== "" || "Ne peut pas être vide";
                    },
                  })}
                  mode="modal"
                  ref={null}
                  onBlur={() => {}}
                  onChange={(e) => setValue(`members.${index}.idRole`, e.id)}
                  data={roleList}
                  labelField="name"
                  valueField="id"
                  value={member.idRole}
                  placeholder="Sélectionner un rôle"
                  placeholderStyle={{ color: colors.onSurfaceVariant }}
                  selectedTextStyle={{ color: colors.onSurfaceVariant }}
                  style={[
                    styles.dropdown,
                    {
                      borderRadius: roundness,
                      borderColor: colors.onSurfaceVariant,
                    },
                  ]}
                  itemTextStyle={{ color: colors.primary }}
                  activeColor={colors.background}
                  containerStyle={{
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.surfaceVariant,
                  }}
                />
                <Dropdown<Student>
                  {...register(`members.${index}.idStudent` as const, {
                    validate: (role) => {
                      return role !== "" || "Ne peut pas être vide";
                    },
                  })}
                  mode="modal"
                  ref={null}
                  onBlur={() => {}}
                  onChange={(e) => setValue(`members.${index}.idStudent`, e.id)}
                  data={studentList}
                  labelField="mail"
                  valueField="id"
                  value={member.idStudent}
                  search
                  placeholder="Sélectionner un étudiant"
                  searchPlaceholder="Sélectionner un étudiant"
                  placeholderStyle={{ color: colors.onSurfaceVariant }}
                  selectedTextStyle={{ color: colors.onSurfaceVariant }}
                  inputSearchStyle={{ color: colors.onSurfaceVariant }}
                  style={[
                    styles.dropdown,
                    {
                      borderRadius: roundness,
                      borderColor: colors.onSurfaceVariant,
                    },
                  ]}
                  itemTextStyle={{ color: colors.primary }}
                  activeColor={colors.background}
                  containerStyle={{
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.surfaceVariant,
                    borderRadius: roundness,
                  }}
                />
              </View>
              <IconButton
                icon={"window-close"}
                mode="outlined"
                iconColor={colors.error}
                onPress={() => remove(index)}
              />
            </View>
            {errors && (
              <HelperText type="error">
                {errors?.members?.[index]?.idRole?.message ||
                  errors?.members?.[index]?.idStudent?.message}
              </HelperText>
            )}
          </View>
        ))}
      </View>
      <IconButton
        icon={"plus"}
        mode="contained"
        style={{ width: "auto" }}
        onPress={() => append({ idRole: "", idStudent: "" })}
      />
    </Container>
  );
}

export const styles = StyleSheet.create({
  // select input
  label: {
    alignSelf: "flex-start",
    zIndex: 2,
    left: 15,
    top: 8,
    paddingHorizontal: 5,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
});
