import { actionStudent } from "@context/studentStore";
import { subscribeAllStudent } from "@fb/service/student.service";
import { useEffect } from "react";

export function useSubStudent() {
  useEffect(() => {
    subscribeAllStudent((studentList) =>
      actionStudent.setAllStudent(studentList)
    );
    return () => {
      subscribeAllStudent((studentList) =>
        actionStudent.setAllStudent(studentList)
      );
    };
  }, []);
}
