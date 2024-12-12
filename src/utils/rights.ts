import { $sessionStore } from "@context/sessionStore";
import { useUnit } from "effector-react";
import { Role } from "types/session.type";

const MODULES = ["POST", "POINT", "OFFICE", "CLUB"] as const;
const RIGHTS = ["CREATE", "UPDATE", "DELETE", "DISPLAY"] as const;

type Module = (typeof MODULES)[number];
type Right = (typeof RIGHTS)[number];

const allCrud: Right[] = ["CREATE", "UPDATE", "DELETE"];

const rights: { [key in Role]: { [key in Module]: Right[] } } = {
  ADMIN: {
    POST: allCrud,
    POINT: allCrud,
    OFFICE: allCrud,
    CLUB: ["DISPLAY"],
  },
  BDE: {
    POST: allCrud,
    POINT: [],
    OFFICE: allCrud,
    CLUB: ["DISPLAY"],
  },
  BDS: {
    POST: allCrud,
    POINT: [],
    OFFICE: allCrud,
    CLUB: ["DISPLAY"],
  },
  BDA: {
    POST: allCrud,
    POINT: [],
    OFFICE: allCrud,
    CLUB: ["DISPLAY"],
  },
  I2C: {
    POST: allCrud,
    POINT: [],
    OFFICE: allCrud,
    CLUB: [],
  },
  BDF: {
    POST: [],
    POINT: allCrud,
    OFFICE: [],
    CLUB: [],
  },
  STUDENT: {
    POINT: [],
    POST: [],
    OFFICE: [],
    CLUB: [],
  },
};

export const useRight = () => {
  const { userId, role } = useUnit($sessionStore);
  const isAdmin = role === "ADMIN";
  const isOffice = ["BDE", "I2C", "BDA", "BDS"].includes(role);
  const isStudent = role === "STUDENT";
  const hasRight = (module: Module, right: Right, officeId?: string) => {
    if (rights[role][module].includes(right)) {
      if (
        ["POST", "OFFICE"].includes(module) &&
        ["UPDATE", "DELETE"].includes(right)
      ) {
        if (officeId === userId || isAdmin) {
          return true;
        } else return false;
      }
      return true;
    } else return false;
  };
  return { hasRight, isAdmin, isOffice, isStudent };
};
