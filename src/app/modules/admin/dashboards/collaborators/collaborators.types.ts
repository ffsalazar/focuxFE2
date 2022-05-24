export interface Collaborator
{
    id: number;
    idFile:number;
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
    isActive: number;
    client: Client;
    leader?:Collaborator;
    isCentralAmerican:number;
    status: Status;
    image:string;

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
    isActive: number;
}

export interface CollaboratorKnowledge
{
    id?: number;
    level: number;
    knowledge: Knowledge;
    isActive: number;
}

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

export interface Phone
{
    id: number;
    number: string;
    type: string;
    isActive: number;
}

export interface Client
{
    id: number;
    name: string;
    description: string;
    isActive: number;
    businessType: BusinessType;
}

export interface BusinessType
{
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: number;
}

export interface Assigments {
    totalOccupation:number;
    assigments : Ocupation[];

}

export interface Ocupation
{
    request: string;
    requestId:number;
    client: string;
    id: number;
    occupationPercentage:number;
    assignmentStartDate:string;
    assignmentEndDate:string;
    code: string;
    observations: string;
    isActive: number;
}

export  interface Request {

    id: number;
    titleRequest:string;
    responsibleRequest:string;
    descriptionRequest:string;
    datePlanEnd:string;
    client:string;
    businessType:string;
    priorityOrder:number;
    status:string;
    completionPercentage:number;
    deviationPercentage:number;
    deliveryDateDeviation:number;
}

export interface Status
{
    id: number;
    name: string;
    description: string;
    isActive: number;
    typeStatus: string;
}
