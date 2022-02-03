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
}

export interface EmployeePosition {
    id:          number;
    department?: EmployeePosition;
    name:        string;
    description: string;
    isActive:    number;
    code?:       string;
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
    client: Client;
    skills: string;
    collaborators: Collaborator[];
    initDate: string;
    endDate: string;
}



export interface Client {
    id: number;
    name: string;
    description: string;
}

export interface Activity {
    id: number;
    name: string;
    description: string;
    progress: string;
    initDate: string;
    endDate: string;
    blockage: boolean;
    blockageDescription?: string;
}
