import { Course } from "./course";
import { Department } from "./department";
import { Semester } from "./semester";

export class Student {
    name: string;
    phno:string;
    address: number;
    dob: Date;
    dateOfJoining: Date;
    email:string;
    isAvailable:boolean;
    academicYear:string;
    password:string;
    deptId:Department;
    courseId:Course;
    semId:Semester;
    id?: number;
    department?:Department;
    course?:Course;
    semester?:Semester;
    type?:string;
    }
