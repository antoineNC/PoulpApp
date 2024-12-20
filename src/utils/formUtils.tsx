import { ReactElement } from "react";
import { FieldValues, ResolverOptions } from "react-hook-form";
import { DateTimeFormPicker } from "components/form/dateTimePicker";
import { TextInputForm } from "components/form/textInput";
import { ChipInputForm } from "components/form/chipInput";
import { SelectInputForm } from "components/form/selectInput";
import { ImagePickerForm } from "components/form/imagePicker";
import { SelectInputProps, FormFieldType } from "types/form.type";
import React from "react";

const regEx_mail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const regEx_name = /^[a-z '-]+$/i;
const errorTxt = {
  required: "Ce champs est obligatoire",
  invalidMail: "L'email est invalide.",
  invalidName: "Certains caractères ne sont pas autorisés",
  invalidLastName: "Nom invalide, certains caractères ne sont pas traités",
  minLenghtPwd: "La longueur minimum est de 4 caractères",
  confirmPwd: "Les mot de passe ne correspondent pas",
  invalidCode: "Code invalide : demandez le code de l'année au BDE",
  dateOrder: "La date de fin doit être APRES la date de début",
};

export function getRulesAndLabel<T extends FieldValues>(
  label: string,
  type?: FormFieldType,
  required?: boolean,
  repeat?: string,
  optionRules?: string[]
) {
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
  if (type === "date") {
    rules = {
      ...rules,
      validate: (value: { start?: Date; end?: Date }) =>
        value?.start &&
        value?.end &&
        (value.start <= value.end || errorTxt.dateOrder),
    };
  }
  if (optionRules)
    optionRules.forEach((element) => {
      switch (element) {
        case "password":
          rules = {
            ...rules,
            minLength: { value: 6, message: errorTxt.minLenghtPwd },
          };
          break;
        case "name":
          rules = {
            ...rules,
            pattern: {
              value: regEx_name,
              message: errorTxt.invalidName,
            },
          };
          break;
        case "mail":
          rules = {
            ...rules,
            pattern: {
              value: regEx_mail,
              message: errorTxt.invalidMail,
            },
          };
          break;
        default:
          break;
      }
    });
  return { rules, newLabel };
}

export function SelectInput<T extends FieldValues>(
  props: SelectInputProps<T>
): ReactElement {
  switch (props.type) {
    case "text":
      return <TextInputForm<T> {...props} />;
    case "image":
      return <ImagePickerForm<T> {...props} />;
    case "date":
      return <DateTimeFormPicker<T> {...props} />;
    case "select":
      return <SelectInputForm<T> {...props} />;
    case "chip":
      return <ChipInputForm<T> {...props} />;
    case "double-select":
      break;
    default:
  }
  return <></>;
}
