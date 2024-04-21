export const CONSTANTS = {
    MAX_FILE: 3,
    MAX_FILES_SIZE: 15728640, // 15 MB in binary
    MAX_PROFILE_PIC_UPLOAD_SIZE: 1000000, // 1 MB
    INTRO_SHOW: 5, // After 5 minutes registration, show intro.
    DUPLICATE_FILES: 'File already present. Please choose a different file.',
    MAX_FILES_MESSAGE: 'Maximum 3 files you can upload.',
    MAX_FILES_SIZE_MESSAGE: 'Total 15 MB you can upload.',
    MAXIMUM_FILE_SIZE_MESSAGE: 'Maximum 15 MB you can upload, at a time.',
    ACCEPT_FILE: 'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, .csv, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/*, video/mp4, audio/mpeg, application/zip, application/gzip',
    FILE_TYPE_SUPPORT: 'We only support .pdf, .xls, .xlsx, .xlsm, .xlsb, .xltx, .csv, .mp3, .mp4, .zip, gzip and online link',
    CHUNK_SIZE: 5 * 1024 * 1024, // 5.2 MB
    // CHUNK_SIZE: 5000000, //5000000

    // 5242880 5243591 5243591 6292167
    BUSSINESS_ANALYSTS_ASSIGNED_TOCHAT: {
        title: 'We are on it !!!',
        body: ' assigned to a chat group.'
    },
    BUSSINESS_ANALYSTS_ASSIGNED_CASE: {
        title: 'Alert',
        body: ' successfully assigned to your case.'
    },
    DATA_ANALYSTS_ASSIGNED_TOCHAT: {
        title: 'Success !!!',
        body: ' assigned to a chat group.'
    },
    DATA_ANALYSTS_ASSIGNED_CASE: {
        title: 'Alert',
        body: ' successfully assigned to your case.'
    },
    DATA_ANALYSTS_ASSIGNED_WORKIN_PROGRESS: {
        title: 'Alert',
        body: ' started working to your case.'
    },
    DATA_ANALYSTS_ASSIGNED_WORK_COMPLETED: {
        title: 'Alert',
        body: ' completed the work.'
    },
    BUSSINESS_ANALYSTS_ASSIGNED_REJECTED_WORK: {
        title: 'Alert <i class="fa fa-exclamation-circle text-danger"></i>',
        body: ' rejected to your case.'
    },
    BUSSINESS_ANALYSTS_REJECTED_DATA_ANALYSTS_WORK: {
        title: 'Alert <i class="fa fa-exclamation-circle text-danger"></i>',
        body: ' rejected submitted work.'
    },
    BUSSINESS_ANALYSTS_ASSIGNED_WORKIN_PROGRESS: {
        title: 'Alert',
        body: ' started working to your case.'
    },
    BUSSINESS_ANALYSTS_ASSIGNED_WORK_COMPLETED: {
        title: 'Alert',
        body: ' completed the work.'
    },
    WAITING_FOR_CUSTOMER_REVIEW: {
        title: 'Alert',
        body: ' waiting for customer review.'
    },
    CUSTOMER_REVIEW_COMPLETED: {
        title: 'Success',
        body: ' reviewed & order fullfiled'
    },
    CUSTOMER_REJECTED_WORK: {
        title: 'Alert',
        body: ' Rejected your work'
    },
    NOTIFICATION_SOUND: 'https://s3.us-west-1.amazonaws.com/essentials.analysts24x7.com/music/notification.mp3',
    NEW_MESSAGE_SOUND: 'https://s3.us-west-1.amazonaws.com/essentials.analysts24x7.com/music/new_msg.mp3',
    PAGESTARTS_FROM: 0,
    NOTIFICATION_PAGESIZE: 10,
    PAGESIZE: 10000,
    WE_CHARGE_PER_HOUR: 10,
    ESTIMATE_TIME_LINE_MIN_QUICK_REQUEST: 5, // Hours - 1/4 days
    ESTIMATE_TIME_LINE_MAX_QUICK_REQUEST: 24, // Hours - 1/4 days
    ESTIMATE_TIME_LINE_PROJECT_REQUEST: 48, // Hours - 2 days
}