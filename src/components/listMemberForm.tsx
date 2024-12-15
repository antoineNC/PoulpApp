import { View } from "react-native";
import { useUnit } from "effector-react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { HelperText, IconButton, MD3Colors } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";

import { $officeStore } from "@context/officeStore";
import { $studentStore } from "@context/studentStore";
import { Container, Text } from "@styledComponents";
import { styles as selectStyles } from "components/form/selectInput";
import { OfficeFormFields, RoleOffice } from "types/office.type";
import { Student } from "types/student.type";

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
      <View style={{ paddingVertical: 20 }}>
        <Text $bold $dark>
          Les membres :
        </Text>
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
                  ref={null}
                  onBlur={() => {}}
                  onChange={(e) => setValue(`members.${index}.idRole`, e.id)}
                  data={roleList}
                  labelField="name"
                  valueField="id"
                  placeholder="Sélectionner un rôle"
                  value={member.idRole}
                  style={[
                    selectStyles.dropdown,
                    {
                      flex: 1,
                      // borderColor: errors.members?.[index]?.idRole
                      //   ? MD3Colors.error50
                      //   : "black",
                    },
                  ]}
                  containerStyle={selectStyles.container}
                  itemTextStyle={{ fontSize: 13 }}
                  selectedTextStyle={{ fontSize: 13 }}
                  placeholderStyle={{ fontSize: 13 }}
                />
                <Dropdown<Student>
                  {...register(`members.${index}.idStudent` as const, {
                    validate: (role) => {
                      return role !== "" || "Ne peut pas être vide";
                    },
                  })}
                  ref={null}
                  onBlur={() => {}}
                  onChange={(e) => setValue(`members.${index}.idStudent`, e.id)}
                  data={studentList}
                  labelField="mail"
                  valueField="id"
                  placeholder="Sélectionner un étudiant"
                  value={member.idStudent}
                  search
                  searchPlaceholder="Sélectionner un étudiant"
                  style={[
                    selectStyles.dropdown,
                    {
                      flex: 1,
                      // borderColor: errors.members?.[index]?.idStudent
                      //   ? MD3Colors.error50
                      //   : "black",
                    },
                  ]}
                  containerStyle={selectStyles.container}
                  itemTextStyle={{ fontSize: 13 }}
                  selectedTextStyle={{ fontSize: 13 }}
                  inputSearchStyle={{ fontSize: 13 }}
                  placeholderStyle={{ fontSize: 13 }}
                />
              </View>
              <IconButton
                icon={"window-close"}
                mode="outlined"
                // iconColor={MD3Colors.error50}
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
        mode="outlined"
        style={{ width: "auto", borderRadius: 5 }}
        onPress={() => append({ idRole: "", idStudent: "" })}
      />
    </Container>
  );
}
