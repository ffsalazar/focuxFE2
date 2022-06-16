export const ROLES = {
    good: 'ROLE_GOD',
    miduule: 'ROLE_MIDDLE',
    basic: 'ROLE_BASIC'
};

export const ACCESS_ROLES = {
    // Dashboard
    projects: [ROLES.good],
    analytics: [ROLES.good],
    finance: [ROLES.good],
    crypto: [ROLES.good],
    vacations: [ROLES.good],
    requestPanel: [ROLES.good],
    collaborators: [ROLES.good, ROLES.miduule, ROLES.basic],
    assignment: [ROLES.good, ROLES.miduule],
    evaluation: [ROLES.good],

    // Apps
    academy: [ROLES.good],
    calendar: [ROLES.good],
    chat: [ROLES.good],
    contacts: [ROLES.good],
    ecommerce: [ROLES.good],
    file: [ROLES.good],
    help: [ROLES.good],
    mail: [ROLES.good],
    notes: [ROLES.good],
    scrumboard: [ROLES.good],
    tasks: [ROLES.good],
    portafolio: [ROLES.good],



    // Collaborator
    employeePosition: [ROLES.good, ROLES.miduule, ROLES.basic],
    departments: [ROLES.good, ROLES.miduule, ROLES.basic],
    knowledges: [ROLES.good, ROLES.miduule, ROLES.basic],

    // Masters
    clients: [ROLES.good, ROLES.miduule],
    businessTypes: [ROLES.good, ROLES.miduule],
    typesRequest: [ROLES.good, ROLES.miduule],
    requestRole: [ROLES.good, ROLES.miduule],
    categories:  [ROLES.good, ROLES.miduule],
    technicalAreas:  [ROLES.good, ROLES.miduule],
    commercialAreas: [ROLES.good, ROLES.miduule],
    statuses: [ROLES.good, ROLES.miduule],
    indicators: [ROLES.good, ROLES.miduule],
    objetives: [ROLES.good, ROLES.miduule],
    evaluations: [ROLES.good, ROLES.miduule],
};
