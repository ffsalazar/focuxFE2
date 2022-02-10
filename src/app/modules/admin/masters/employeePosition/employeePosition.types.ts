
export interface Department
{
    id: number;
    code: string;
    isActive: number;
    name: string;
    description: string;
}

export interface EmployeePosition
{
    id: number;
    name: string;
    description: string;
    isActive: number;
    department: Department;
}

