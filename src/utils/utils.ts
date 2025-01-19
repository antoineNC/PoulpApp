import { FirebaseError } from "firebase/app";

export const capitalize = <T extends string>(s: T) =>
  (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

export function getErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return error.code;
  } else if (error instanceof Error) {
    return error.message;
  }
  console.error(error);
  return String(error);
}
