import { Staff } from "./staff";
import { Student } from "./student";
import { Subject } from "./subject";

export class Enrollment {
    id?:number;
    studentId:Student;
    staffId: Staff;
    subjectId: Subject;
}

