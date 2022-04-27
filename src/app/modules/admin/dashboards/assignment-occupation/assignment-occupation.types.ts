export interface Collaborator {
    id:                    number;
    idFile:                number;
    name:                  string;
    lastName:              string;
    employeePosition:      EmployeePosition;
    companyEntryDate:      string;
    organizationEntryDate: string;
    gender:                string;
    bornDate:              string;
    nationality:           string;
    mail:                  string;
    isActive:              number;
    assignedLocation:      string;
    technicalSkills:       string;
    knowledges:            KnowledgeElement[];
    phones:                Phone[];
    assignation?:           string;
    progress?:              number;
    client?:                 Client;
}

export interface RolesRequest {
    id:             number,
    name:           string,
    description:    string,
    isActive:       number,
}

export interface Knowledge
{
    id: number;
    type: string;
    description: string;
    name: string;
    isActive: number;
}

export interface EmployeePosition {
    id:          number;
    department?: EmployeePosition;
    name:        string;
    description: string;
    isActive:    number;
    code?:       string;
}

export interface Status {
    id: number,
    typeStatus: string,
    name: string,
    description: string,
    isActive: number,
}

export interface CollaboratorOcupation {
    id: number,
    name: string,
    ocupation: number,
    observation: string,
    dateInit: string,
    dateEnd: string,
}


export interface AssignationOccupation {
    occupationPercentage: number,
    assignmentStartDate: string,
    assignmentEndDate: string,
    code: string,
    observations: string,
    isActive: 1,
    request: any,
    collaborator: any,
    requestRole: any,
}

export interface Client
{
    id: number;
    name: string;
    description: string;
    isActive: number;
    businessType: any;
}

export interface KnowledgeElement {
    id: number;
    knowledge: KnowledgeKnowledge;
    level: number;
}

export interface KnowledgeKnowledge {
    id:          number;
    description: string;
    type:        string;
    name:        string;
}

export interface Phone {
    id:     number;
    number: string;
    type:   string;
}


export interface Project {
    id: number;
    description: string;
    name: string;
    client: any;
    skills: string;
    collaborators: Collaborator[];
    initDate: string;
    endDate: string;
}



// export interface Client {
//     id: number;
//     name: string;
//     description: string;
// }

export interface Activity {
    id: number;
    name: string;
    colaboratorName?: string;
    description: string;
    progress: string;
    initDate: string;
    endDate: string;
    blockage: boolean;
    blockageDescription?: string;
}
