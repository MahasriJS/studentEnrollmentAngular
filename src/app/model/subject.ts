import { Course } from "./course";
import { Semester } from "./semester";

export class Subject {
    name:string;
    code:string;
    credits:number;
    courseId:Course;
    semesterId:Semester;
    id?:number;
}
