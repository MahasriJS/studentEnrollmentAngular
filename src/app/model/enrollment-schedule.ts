import { Course } from "./course";
import { Department } from "./department";
import { Semester } from "./semester";

export class EnrollmentSchedule {
    id?:number;
    isStarted:boolean;
    academicYear:string;
    deptId:Department;
    courseId:Course;
    semId:Semester;
}
