/* eslint-disable */
import * as moment from 'moment';

export const project = {
    githubIssues      : {
        overview: {
            'this-week': {
                'new-issues'   : 214,
                'closed-issues': 75,
                'fixed'        : 3,
                'wont-fix'     : 4,
                're-opened'    : 8,
                'needs-triage' : 6
            },
            'last-week': {
                'new-issues'   : 197,
                'closed-issues': 72,
                'fixed'        : 6,
                'wont-fix'     : 11,
                're-opened'    : 6,
                'needs-triage' : 5
            }
        },
        labels  : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        series  : {
            'this-week': [
                {
                    name: 'Solicitudes activas',
                    type: 'line',
                    data: [42, 28, 43, 34, 20, 25, 22,26,39,48,23,18]
                },
                {
                    name: 'solicitudes inactivas',
                    type: 'column',
                    data: [11, 10, 8, 11, 8, 10, 17,14,16,11,9,13]
                }
            ],
            'last-week': [
                {
                    name: 'Solicitudes activas',
                    type: 'line',
                    data: [37, 32, 39, 27, 18, 24, 20,29,33,36,34,41]
                },
                {
                    name: 'solicitudes inactivas',
                    type: 'column',
                    data: [9, 8, 10, 12, 7, 11, 15,14,6,13,16,19]
                }
            ]
        }
    },
    taskDistribution  : {
        overview: {
            'this-week': {
                'nuevos'      : 594,
                'completedos': 287
            },
            'last-week': {
                'nuevos'      : 526,
                'completedos': 260
            }
        },
        labels  : ['EPA', 'MAYOREO', 'MODA', 'LOGISTICO', 'INMOBILIARIO', 'BECONSULT', 'CREDIX', 'AUTOMUNDIAL', 'CDC'],
        series  : {
            'this-week': [30, 17, 10, 7, 11, 10, 21, 2, 1],
            'last-week': [27, 20, 10, 7, 11, 10, 21, 2, 1]
        }
    },
    schedule          : {
        today   : [
            {
                title   : 'Meet Grupal',
                time    : 'en 32 minutos',
                location: 'sala de conferencia 1B'
            },
            {
                title: 'Desplegar V-1.2.1 Interfaces CAIN',
                time : '10:30 AM'
            },
            {
                title: 'Publicar actualizacion Beta',
                time : '11:00 AM'
            },
            {
                title: 'Lanzamiento',
                time : '12:10 PM'
            },
            {
                title   : 'Revisión Distribución de Colaboradores',
                time    : '05:30 PM',
                location: 'Costa Rica'
            },
            {
                title   : 'Revisión SLA',
                time    : '07:30 PM',
                location: 'Casa'
            },
            {
                title   : 'Seguimiento Clockify',
                time    : '09:30 PM',
                location: 'Salon de fiesta'
            }
        ],
        tomorrow: [
            {
                title   : 'Marketing Meeting',
                time    : '09:00 AM',
                location: 'sala de conferencia 1A'
            },
            {
                title: 'Anuncio Publico',
                time : '11:00 AM'
            },
            {
                title: 'Lanzamiento',
                time : '12:10 PM'
            },
            {
                title   : 'Reunión con probadores beta',
                time    : '03:00 PM',
                location: 'sala de conferencia 2C'
            },
            {
                title: 'Transmisión en vivo',
                time : '05:30 PM'
            },
            {
                title   : 'Fiesta de lanzamiento',
                time    : '07:30 PM',
                location: 'Casa del CEO'
            },
            {
                title   : 'Meet Celulas',
                time    : '09:30 PM',
                location: 'sala de conferencia 7H '
            }
        ]
    },
    budgetDistribution: {
        categories: ['Concepto','Diseño', 'Desarrollo', 'Extras', 'Marketing'],
        series    : [
            {
                name: 'Budget',
                data: [12, 20, 28, 15, 25]
            }
        ]
    },
    weeklyExpenses    : {
        amount: 17663,
        labels: [
            moment().subtract(47, 'days').format('DD MMM') + ' - ' + moment().subtract(40, 'days').format('DD MMM'),
            moment().subtract(39, 'days').format('DD MMM') + ' - ' + moment().subtract(32, 'days').format('DD MMM'),
            moment().subtract(31, 'days').format('DD MMM') + ' - ' + moment().subtract(24, 'days').format('DD MMM'),
            moment().subtract(23, 'days').format('DD MMM') + ' - ' + moment().subtract(16, 'days').format('DD MMM'),
            moment().subtract(15, 'days').format('DD MMM') + ' - ' + moment().subtract(8, 'days').format('DD MMM'),
            moment().subtract(7, 'days').format('DD MMM') + ' - ' + moment().format('DD MMM')
        ],
        series: [
            {
                name: 'Expenses',
                data: [4412, 4345, 4541, 4677, 4322, 4123]
            }
        ]
    },
    monthlyExpenses   : {
        amount: 54663,
        labels: [
            moment().subtract(31, 'days').format('DD MMM') + ' - ' + moment().subtract(24, 'days').format('DD MMM'),
            moment().subtract(23, 'days').format('DD MMM') + ' - ' + moment().subtract(16, 'days').format('DD MMM'),
            moment().subtract(15, 'days').format('DD MMM') + ' - ' + moment().subtract(8, 'days').format('DD MMM'),
            moment().subtract(7, 'days').format('DD MMM') + ' - ' + moment().format('DD MMM')
        ],
        series: [
            {
                name: 'Expenses',
                data: [15521, 15519, 15522, 15521]
            }
        ]
    },
    yearlyExpenses    : {
        amount: 648813,
        labels: [
            moment().subtract(79, 'days').format('DD MMM') + ' - ' + moment().subtract(72, 'days').format('DD MMM'),
            moment().subtract(71, 'days').format('DD MMM') + ' - ' + moment().subtract(64, 'days').format('DD MMM'),
            moment().subtract(63, 'days').format('DD MMM') + ' - ' + moment().subtract(56, 'days').format('DD MMM'),
            moment().subtract(55, 'days').format('DD MMM') + ' - ' + moment().subtract(48, 'days').format('DD MMM'),
            moment().subtract(47, 'days').format('DD MMM') + ' - ' + moment().subtract(40, 'days').format('DD MMM'),
            moment().subtract(39, 'days').format('DD MMM') + ' - ' + moment().subtract(32, 'days').format('DD MMM'),
            moment().subtract(31, 'days').format('DD MMM') + ' - ' + moment().subtract(24, 'days').format('DD MMM'),
            moment().subtract(23, 'days').format('DD MMM') + ' - ' + moment().subtract(16, 'days').format('DD MMM'),
            moment().subtract(15, 'days').format('DD MMM') + ' - ' + moment().subtract(8, 'days').format('DD MMM'),
            moment().subtract(7, 'days').format('DD MMM') + ' - ' + moment().format('DD MMM')
        ],
        series: [
            {
                name: 'Expenses',
                data: [45891, 45801, 45834, 45843, 45800, 45900, 45814, 45856, 45910, 45849]
            }
        ]
    },
    budgetDetails     : {
        columns: ['type', 'total', 'expensesAmount', 'expensesPercentage', 'remainingAmount', 'remainingPercentage'],
        rows   : [
            {
                id                 : 1,
                type               : 'Concepto',
                total              : 14880,
                expensesAmount     : 14000,
                expensesPercentage : 94.08,
                remainingAmount    : 880,
                remainingPercentage: 5.92
            },
            {
                id                 : 2,
                type               : 'Diseño',
                total              : 21080,
                expensesAmount     : 17240.34,
                expensesPercentage : 81.78,
                remainingAmount    : 3839.66,
                remainingPercentage: 18.22
            },
            {
                id                 : 3,
                type               : 'Desarrolo',
                total              : 34720,
                expensesAmount     : 3518,
                expensesPercentage : 10.13,
                remainingAmount    : 31202,
                remainingPercentage: 89.87
            },
            {
                id                 : 4,
                type               : 'Extras',
                total              : 18600,
                expensesAmount     : 0,
                expensesPercentage : 0,
                remainingAmount    : 18600,
                remainingPercentage: 100
            },
            {
                id                 : 5,
                type               : 'Marketing',
                total              : 34720,
                expensesAmount     : 19859.84,
                expensesPercentage : 57.2,
                remainingAmount    : 14860.16,
                remainingPercentage: 42.8
            }
        ]
    },
    teamMembers       : [
        {
            id    : '2bfa2be5-7688-48d5-b5ac-dc0d9ac97f14',
            avatar: 'assets/images/avatars/female-10.jpg',
            name  : 'Nadia Mcknight',
            email : 'nadiamcknight@mail.com',
            phone : '+1-943-511-2203',
            title : 'Project Director'
        },
        {
            id    : '77a4383b-b5a5-4943-bc46-04c3431d1566',
            avatar: 'assets/images/avatars/male-19.jpg',
            name  : 'Best Blackburn',
            email : 'blackburn.best@beadzza.me',
            phone : '+1-814-498-3701',
            title : 'Senior Developer'
        },
        {
            id    : '8bb0f597-673a-47ca-8c77-2f83219cb9af',
            avatar: 'assets/images/avatars/male-14.jpg',
            name  : 'Duncan Carver',
            email : 'duncancarver@mail.info',
            phone : '+1-968-547-2111',
            title : 'Senior Developer'
        },
        {
            id    : 'c318e31f-1d74-49c5-8dae-2bc5805e2fdb',
            avatar: 'assets/images/avatars/male-01.jpg',
            name  : 'Martin Richards',
            email : 'martinrichards@mail.biz',
            phone : '+1-902-500-2668',
            title : 'Junior Developer'
        },
        {
            id    : '0a8bc517-631a-4a93-aacc-000fa2e8294c',
            avatar: 'assets/images/avatars/female-20.jpg',
            name  : 'Candice Munoz',
            email : 'candicemunoz@mail.co.uk',
            phone : '+1-838-562-2769',
            title : 'Lead Designer'
        },
        {
            id    : 'a4c9945a-757b-40b0-8942-d20e0543cabd',
            avatar: 'assets/images/avatars/female-01.jpg',
            name  : 'Vickie Mosley',
            email : 'vickiemosley@mail.net',
            phone : '+1-939-555-3054',
            title : 'Designer'
        },
        {
            id    : 'b8258ccf-48b5-46a2-9c95-e0bd7580c645',
            avatar: 'assets/images/avatars/female-02.jpg',
            name  : 'Tina Harris',
            email : 'tinaharris@mail.ca',
            phone : '+1-933-464-2431',
            title : 'Designer'
        },
        {
            id    : 'f004ea79-98fc-436c-9ba5-6cfe32fe583d',
            avatar: 'assets/images/avatars/male-02.jpg',
            name  : 'Holt Manning',
            email : 'holtmanning@mail.org',
            phone : '+1-822-531-2600',
            title : 'Marketing Manager'
        },
        {
            id    : '8b69fe2d-d7cc-4a3d-983d-559173e37d37',
            avatar: 'assets/images/avatars/female-03.jpg',
            name  : 'Misty Ramsey',
            email : 'mistyramsey@mail.us',
            phone : '+1-990-457-2106',
            title : 'Consultant'
        }
    ]
};
