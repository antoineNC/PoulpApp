import { createEvent, createStore } from "effector";

const actionStudent = {
  setAllStudent: createEvent<Student[]>("SET_ALL_STUDENT"),
  logout: createEvent("LOGOUT"),
};

const defaultStudentList: Student[] = [];

const $studentStore = createStore(defaultStudentList)
  .on(actionStudent.setAllStudent, (_, studentList) => studentList)
  .reset(actionStudent.logout);

export { actionStudent, $studentStore };