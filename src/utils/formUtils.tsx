import { ReactElement, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  ResolverOptions,
} from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { FormFieldOptions, FormFieldType } from "@types";
import { Text } from "@styledComponents";
import { colors } from "@theme";
import { CODE_ENSC } from "data";
import AntDesign from "@expo/vector-icons/AntDesign";

export type ControlFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  repeat?: string;
};
export type FormFieldProps = {
  label: string;
  type: FormFieldType;
  options?: FormFieldOptions;
  index: number;
  lastInput: boolean;
  setFocus: (state: number) => void;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

type FieldInputProps<T extends FieldValues> = FormFieldProps & {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
};

type Params<T extends FieldValues> = {
  newLabel: string;
  rules?: Omit<ResolverOptions<T>, keyof FieldValues>;
};

const regEx_mail = /^[\w\-\.]+@ensc\.fr$/gm; // au lieu peut-etre faire un tooltip pour expliquer
const regEx_name = /^[a-z '-]+$/i;
const errorTxt = {
  required: "Ce champs est obligatoire",
  invalidMail: "L'email est invalide",
  invalidName: "Certains caractères ne sont pas autorisés",
  invalidLastName: "Nom invalide, certains caractères ne sont pas traités",
  minLenghtPwd: "La longueur minimum est de 4 caractères",
  confirmPwd: "Les mot de passe ne correspondent pas",
  invalidCode: "Code invalide. Demandez le code de l'année au BDE.",
};

export function getFieldProps<T extends FieldValues>(
  label: string,
  required?: boolean,
  repeat?: string,
  optionRules?: string[]
): Params<T> {
  const newLabel = label.concat(required ? " *" : "");
  let rules: Omit<ResolverOptions<T>, keyof FieldValues> = {};
  if (required)
    rules = {
      ...rules,
      required: errorTxt.required,
    };
  if (repeat)
    rules = {
      ...rules,
      validate: (value: string) => value === repeat || errorTxt.confirmPwd,
    };
  if (optionRules)
    optionRules.forEach((element) => {
      switch (element) {
        case "password":
          rules = {
            ...rules,
            minLength: { value: 4, message: errorTxt.minLenghtPwd },
          };
        case "name":
          rules = {
            ...rules,
            pattern: {
              value: regEx_name,
              message: errorTxt.invalidName,
            },
          };
      }
    });
  return { rules, newLabel };
}

export function getFieldInput<T extends FieldValues>({
  label,
  type,
  options,
  index,
  lastInput,
  setFocus,
  submit,
  field: { onChange, onBlur, value, ref },
  fieldState: { invalid, error },
}: FieldInputProps<T>): ReactElement {
  const [hide, setHide] = useState(true);
  switch (type) {
    case "text":
      return (
        <View>
          <TextInput
            ref={ref}
            mode="outlined"
            multiline={options?.multiline}
            label={label}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={invalid}
            autoFocus={index === 0}
            enterKeyHint={lastInput ? "done" : "next"}
            inputMode={options?.inputMode}
            autoCapitalize={options?.autoCap}
            secureTextEntry={options?.secureText && hide}
            right={
              options?.secureText ? (
                hide ? (
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setHide((prev) => !prev)}
                  />
                ) : (
                  <TextInput.Icon
                    icon="eye-off"
                    onPress={() => setHide((prev) => !prev)}
                  />
                )
              ) : null
            }
            onSubmitEditing={
              lastInput
                ? async (e) => await submit(e)
                : () => setFocus(index + 1)
            }
            style={{ backgroundColor: colors.secondary }}
          />
          {error && <HelperText type="error">{error.message}</HelperText>}
        </View>
      );
    case "image":
      break;
    case "date":
      break;
    case "select":
      return (
        <View>
          {options?.choices && (
            <>
              <Text $dark $size="s" style={styles.label}>
                {label}
              </Text>
              <Dropdown
                data={options.choices}
                value={value}
                valueField="value"
                labelField="label"
                onBlur={onBlur}
                onChange={onChange}
                style={styles.dropdown}
                placeholder={"Sélectionner un bureau"}
                containerStyle={styles.container}
                activeColor={colors.secondary}
                mode="modal"
              />
            </>
          )}
          {error && <HelperText type="error">{error.message}</HelperText>}
        </View>
      );
    case "chip":
      const renderItem = (item: { value: string; label: string }) => {
        return (
          <View key={item.value} style={styles.item}>
            <Text $dark>{item.label}</Text>
          </View>
        );
      };
      return (
        <View>
          {options?.choices && (
            <>
              <Text $dark $size="s" style={styles.label}>
                {label}
              </Text>
              <MultiSelect
                data={options.choices}
                value={value}
                valueField="value"
                labelField="label"
                onChange={onChange}
                onBlur={onBlur}
                mode="modal"
                search
                placeholder="Sélectionner des tags"
                searchPlaceholder="Chercher..."
                style={styles.dropdown}
                containerStyle={styles.container}
                inputSearchStyle={styles.inputSearch}
                activeColor={colors.secondary}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => unSelect && unSelect(item)}
                  >
                    <View style={styles.selectedStyle}>
                      <Text $size="m" style={styles.textSelectedStyle}>
                        {item.label}
                      </Text>
                      <AntDesign color="white" name="delete" />
                    </View>
                  </TouchableOpacity>
                )}
              />
              {error && <HelperText type="error">{error.message}</HelperText>}
            </>
          )}
        </View>
      );
    case "double-select":
      break;
    default:
  }
  return <View></View>;
}

const styles = StyleSheet.create({
  // select input
  dropdown: {
    height: 50,
    borderWidth: 0.7,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  label: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondary,
    zIndex: 2,
    left: 15,
    top: 8,
    paddingHorizontal: 5,
  },
  //list of choices
  container: {
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  inputSearch: { borderRadius: 5, height: 50 },
  item: {
    padding: 20,
  },
  // chips
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: { marginRight: 5 },
});
