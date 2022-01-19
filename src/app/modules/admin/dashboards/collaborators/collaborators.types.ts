export interface Collaborator
{
    id: string;
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
    tags: string[];
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

export interface Tag
{
    id?: string;
    title?: string;
}
