import { Department } from "./department";

export class Staff {
    name: string;
    phno:string;
    address: number;
    dob: Date;
    dateOfJoining: Date;
    email:string;
    isAvailable:boolean;
    academicYear:string;
    password:string;
    department?:Department;
    type?:string;
    designation:string;
    salary:number;
    id?: number;
    deptId?:Department;
}
