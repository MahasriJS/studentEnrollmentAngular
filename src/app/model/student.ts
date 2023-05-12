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
    isAvailable:boolean=true;
    academicYear:string;
    password?:string;
    deptId:number;
    courseId:number;
    semId:number;
    id?: number;
    department?:Department;
    course?:Course;
    semester?:Semester;
    type?:string;
    }
