export interface Collaborator
{
    id: number;
    avatar?: string | null;
    background?: string | null;
    name: string;
    mail: string;
    nationality: string;
    lastName: string;
    departament: string;
    employeePosition: string | null;
    companyEntryDate:string;
    organizationEntryDate:string;
    gender:string;
    bornDate:string;
    address?: string | null;
    knowledges: CollaboratorKnowledge[];
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
