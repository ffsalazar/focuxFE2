import { Injectable, TemplateRef } from '@angular/core';

export interface Request {
    id: number;
    category: Category;
    client: Client;
    code: String;
    collaboratorsAssigned: [];
    commentsClient: String;
    commentsIntelix: String;
    commercialArea: CommercialArea;
    completionPercentage: number;
    dateInit: Date;
    datePlanEnd: Date;
    dateRealEnd: Date;
    dateRequest: Date;
    deliverablesCompletedIntelix: String;
    descriptionRequest: string;
    deviationPercentage: number;
    deliveryDateDeviation: number;
    internalFeedbackIntelix: String;
    isActive: number;
    pendingActivitiesIntelix: String;
    priorityOrder: number;
    requestPeriod: RequestPeriod;
    responsibleRequest: ResponsibleRequest;
    solverGroup: SolverGroup;
    status: Status;
    technicalArea: TechnicalArea;
    titleRequest: string;
    typeRequest: TypeRequest;
    updateDate: Date;
    knowledges: any;
    pauses: Pause[];
}

export interface Category {
    id: number;
    name: string;
    description: string;
    isActive: number;
}

export interface Client {
    id: number;
    name: string;
    description: string;
    isActive: number;
    businessType: BusinessType;
}

export interface BusinessType {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: number;
}

export interface CommercialArea {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: number;
}

export interface RequestPeriod {
    id: number;
    name: string;
    description: string;
    isActive: number;
}

export interface Collaborator {
    id: number;
    avatar?: string | null;
    background?: string | null;
    name: string;
    mail: string;
    nationality: string;
    lastName: string;
    employeePosition: EmployeePosition | null;
    companyEntryDate: string;
    organizationEntryDate: string;
    gender: string;
    bornDate: string;
    assignedLocation?: string | null;
    knowledges: CollaboratorKnowledge[];
    phones: Phone[];
    file?: string | null;
    isActive: number;
    client: Client;
}
export interface EmployeePosition {
    id: number;
    name: String;
    description: String;
    isActive: boolean;
    department: Department;
}

export interface Department {
    id: number;
    code: string;
    isActive: boolean;
    name: string;
    description: string;
}

export interface Phone {
    id: number;
    number: string;
    type: string;
    isActive: number;
}

export interface CollaboratorKnowledge {
    id?: number;
    level: number;
    knowledge: Knowledge;
    isActive: number;
}

export interface Knowledge {
    id: number;
    type: string;
    description: string;
    name: string;
}

export interface TypeRequest {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: number;
}

export interface SolverGroup {
    id: number;
    idFile: number;
    name: string;
    lastName: string;
    employeePosition: EmployeePosition;
}

export interface TechnicalArea {
    id: number;
    code: string;
    name: string;
    description: string;
    isActive: number;
}

export interface Status {
    id: number;
    typeStatus: string;
    name: string;
    description: string;
    isActive: number;
}

export interface Knowledge {
    id: number;
    type: string;
    description: string;
    name: string;
    isActive: number;
}
export interface Pause
{
    id: number;
    comments: string;
    dateEndPause: Date;
    dateInitPause: Date;
    createdBy: string;
    createdOn: string;
    totalPauseDays: number;
}
export interface ResponsibleRequest {
    id: number;
    idFile: number;
    name: string;
    lastName: string;
    employeePosition: EmployeePosition;
    companyEntryDate: Date;
    organizationEntryDate: Date;
    gender: string;
    bornDate: Date;
    nationality: string;
    mail: string;
    isActive: number;
    assignedLocation: string;
    technicalSkills: string;
    knowledges: Knowledge[];
    phones: Phone[];
    client: Client;
    assigments: Assigment[];
}

export interface Assigment {
    id: number;
    occupationPercentage: number;
    assignmentStartDate: Date;
    assignmentEndDate: Date;
    code: string;
    observations: string;
    isActive: number;
}

export interface DialogOptions {
    width: number;
    disableClose: boolean;
    minHeight?: number;
    height?: number;
    panelClass?: string;
}

export interface DialogData {
    template?: TemplateRef<any>;
    component?: any;
    title?: string;
    hideCloseButton?: boolean;
    data?: any;
}
