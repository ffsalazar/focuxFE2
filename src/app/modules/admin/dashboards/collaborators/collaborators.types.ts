export interface Collaborator
{
    id: number;
    avatar?: string | null;
    background?: string | null;
    name: string;
    mail: string;
    nationality: string;
    lastName: string;
    employeePosition: EmployeePosition | null;
    companyEntryDate:string;
    organizationEntryDate:string;
    gender:string;
    bornDate:string;
    assignedLocation?: string | null;
    knowledges: CollaboratorKnowledge[];
    phones: Phone[];
    file?:string | null;
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Knowledge
{
    id: number;
    type: string;
    description: string;
    name: string;
}

export interface CollaboratorKnowledge 
{
    id: number;
    level: number;
    knowledge: Knowledge;
}

export interface Department
{
    id: number;
    code: string;
    isActive: boolean;
    name: string;
    description: string;
}
export interface Position 
{
    id: number;
    name: string;
    description: string;
    isActive: boolean;
}
export interface EmployeePosition 
{
    id: number;
    position: Position
    isActive: boolean;
    department: Department;
}

export interface Phone
{
    id: number;
    number: string;
}