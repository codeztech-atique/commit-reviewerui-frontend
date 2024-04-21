//  This global status of each and every task

var customStepsProjectRequest = [
    {
        stepNo: 1,
        stepName: "Document status",
        status: "completed"
    },
    {
        stepNo: 2,
        stepName: "Bussiness analyst assigned",
        status: "disabled"
    },
    {
        stepNo: 3,
        stepName: "Data analyst assigned",
        status: "disabled"
    },
    {
        stepNo: 4,
        stepName: "Work in progress",
        status: "disabled"
    },
    {
        stepNo: 5,
        stepName: "Work completed",
        status: "disabled"
    },
    {
        stepNo: 6,
        stepName: "Reviewed by bussiness analyst",
        status: "disabled"
    },
    {
        stepNo: 7,
        stepName: "Reviewed by customer",
        status: "disabled"
    },
    {
        stepNo: 8,
        stepName: "Order Fulfilled",
        status: "disabled"
    }
];

var customStepsQuickRequest = [
    {
        stepNo: 1,
        stepName: "Document status",
        status: "completed"
    },
    {
        stepNo: 2,
        stepName: "Bussiness analyst assigned",
        status: "disabled"
    },
    {
        stepNo: 3,
        stepName: "Work in progress",
        status: "disabled"
    },
    {
        stepNo: 4,
        stepName: "Work completed",
        status: "disabled"
    },
    {
        stepNo: 5,
        stepName: "Reviewed by customer",
        status: "disabled"
    },
    {
        stepNo: 6,
        stepName: "Order Fulfilled",
        status: "disabled"
    }
];

var approximateTimeLine = [
    {
        selectedTimeline: 'Quick request ( Approximate time to complete with in 1 days )',
        selectedTimelineInHrs: 24
    },
    {
        selectedTimeline: 'Project request ( Approximate time to complete with in 7 days or more )',
        selectedTimelineInHrs: 168
    }
];

var doYouHaveFile = [
    "Yes", "No"
];

var whatYouWantedToUpload = [
    "Single or multiple file", "Custom links"
];

var userInteractionFlow = {
    headings: [
        "Welcome to Analysts24x7! We are delighted to have you here. How may we be of service to you today?",
        "Please choose from the following options to ensure we provide you with the most appropriate assistance:",
    ],
    options: [
        {
            id: "service_selection",
            label: "Service Selection",
            context: "Click here to explore our range of services."
        },
        {
            id: "technical_support",
            label: "Technical Support",
            context: "Click here to explore our range of services."
        },
        {
            id: "account_assistance",
            label: "Account Assistance ",
            context: "Click here for any queries related to your account."
        }
    ]
}


export {
    customStepsProjectRequest,
    customStepsQuickRequest,
    approximateTimeLine,
    doYouHaveFile,
    whatYouWantedToUpload,
    userInteractionFlow,
};