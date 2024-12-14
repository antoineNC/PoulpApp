import { actionStudent } from "@context/studentStore";
import { subscribeAllStudent } from "@fb/service/student.service";
import { useEffect } from "react";

export function useSubStudent() {
  useEffect(() => {
    const unsub = subscribeAllStudent((studentList) =>
      actionStudent.setAllStudent(studentList)
    );
    return () => unsub();
  }, []);
}
