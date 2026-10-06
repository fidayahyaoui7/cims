// Common translations used across the application
export const COMMON = {
  BUTTONS: {
    SAVE: 'buttons.save',
    CANCEL: 'buttons.cancel',
    SUBMIT: 'buttons.submit',
    BACK: 'buttons.back',
    NEXT: 'buttons.next',
    CONFIRM: 'buttons.confirm',
    CLOSE: 'buttons.close',
    EDIT: 'buttons.edit',
    DELETE: 'buttons.delete',
    SEARCH: 'buttons.search',
    LOGIN: 'buttons.login',
    LOGOUT: 'buttons.logout',
    REGISTER: 'buttons.register',
    BOOK_APPOINTMENT: 'buttons.book_appointment',
    VIEW_DETAILS: 'buttons.view_details'
  },
  LABELS: {
    EMAIL: 'labels.email',
    PASSWORD: 'labels.password',
    CONFIRM_PASSWORD: 'labels.confirm_password',
    FULL_NAME: 'labels.full_name',
    PHONE: 'labels.phone',
    ADDRESS: 'labels.address',
    CITY: 'labels.city',
    REGION: 'labels.region',
    COUNTRY: 'labels.country',
    POSTAL_CODE: 'labels.postal_code'
  },
  MESSAGES: {
    LOADING: 'messages.loading',
    ERROR: 'messages.error',
    SUCCESS: 'messages.success',
    NO_DATA: 'messages.no_data',
    TRY_AGAIN: 'messages.try_again',
    REQUIRED_FIELD: 'messages.required_field',
    INVALID_EMAIL: 'messages.invalid_email',
    PASSWORD_MISMATCH: 'messages.password_mismatch'
  }
};

// Navigation translations
export const NAVIGATION = {
  HOME: 'navigation.home',
  HOSPITALS: 'navigation.hospitals',
  APPOINTMENTS: 'navigation.appointments',
  PROFILE: 'navigation.profile',
  SETTINGS: 'navigation.settings',
  HELP: 'navigation.help',
  ABOUT: 'navigation.about',
  LOGIN: 'navigation.login',
  REGISTER: 'navigation.register',
  LOGOUT: 'navigation.logout',
  DASHBOARD: 'navigation.dashboard'
};

// Hospital related translations
export const HOSPITAL = {
  TYPES: {
    PUBLIC: 'hospital.types.public',
    PRIVATE: 'hospital.types.private',
    UNIVERSITY: 'hospital.types.university',
    REGIONAL: 'hospital.types.regional'
  },
  DETAILS: {
    ADDRESS: 'hospital.details.address',
    PHONE: 'hospital.details.phone',
    EMAIL: 'hospital.details.email',
    WEBSITE: 'hospital.details.website',
    SERVICES: 'hospital.details.services',
    HOURS: 'hospital.details.hours',
    GET_DIRECTIONS: 'hospital.details.get_directions',
    BOOK_APPOINTMENT: 'hospital.details.book_appointment'
  }
};

// Appointment related translations
export const APPOINTMENT = {
  TITLE: 'appointment.title',
  DATE: 'appointment.date',
  TIME: 'appointment.time',
  TYPE: 'appointment.type',
  STATUS: {
    PENDING: 'appointment.status.pending',
    CONFIRMED: 'appointment.status.confirmed',
    COMPLETED: 'appointment.status.completed',
    CANCELLED: 'appointment.status.cancelled'
  },
  MESSAGES: {
    BOOK_SUCCESS: 'appointment.messages.book_success',
    BOOK_ERROR: 'appointment.messages.book_error',
    CANCEL_CONFIRM: 'appointment.messages.cancel_confirm',
    CANCELLED: 'appointment.messages.cancelled'
  }
};

// Radiology exam types
export const RADIOLOGY = {
  TYPES: {
    XRAY: 'radiology.types.xray',
    ULTRASOUND: 'radiology.types.ultrasound',
    CT: 'radiology.types.ct',
    MRI: 'radiology.types.mri',
    MAMMOGRAPHY: 'radiology.types.mammography',
    FLUOROSCOPY: 'radiology.types.fluoroscopy',
    DEXA: 'radiology.types.dexa'
  },
  DURATION: 'radiology.duration',
  PREPARATION: 'radiology.preparation',
  DESCRIPTION: 'radiology.description'
};

// Error messages
export const ERRORS = {
  TITLE: 'errors.title',
  NOT_FOUND: 'errors.not_found',
  UNAUTHORIZED: 'errors.unauthorized',
  FORBIDDEN: 'errors.forbidden',
  SERVER_ERROR: 'errors.server_error',
  NETWORK_ERROR: 'errors.network_error',
  VALIDATION: 'errors.validation',
  UNKNOWN: 'errors.unknown'
};

// Success messages
export const SUCCESS = {
  TITLE: 'success.title',
  SAVED: 'success.saved',
  UPDATED: 'success.updated',
  DELETED: 'success.deleted',
  APPOINTMENT_BOOKED: 'success.appointment_booked',
  APPOINTMENT_CANCELLED: 'success.appointment_cancelled'
};
