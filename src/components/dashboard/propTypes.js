import PropTypes from 'prop-types';

export const AppointmentType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  doctor: PropTypes.string.isRequired,
  specialty: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['scheduled', 'completed', 'cancelled']).isRequired,
  notes: PropTypes.string,
});

export const MessageType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  from: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  read: PropTypes.bool.isRequired,
});

export const ResultType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['lab', 'radiology', 'prescription']).isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  fileUrl: PropTypes.string,
  notes: PropTypes.string,
});

export const CenterType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  distance: PropTypes.number,
  phone: PropTypes.string,
  hours: PropTypes.string,
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
});

export const UserType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string,
  dateOfBirth: PropTypes.instanceOf(Date),
  gender: PropTypes.oneOf(['male', 'female', 'other']),
  bloodType: PropTypes.string,
  address: PropTypes.string,
  profileImage: PropTypes.string,
});

export const PositionType = PropTypes.shape({
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  accuracy: PropTypes.number,
  timestamp: PropTypes.number,
});

export const LoadingStateType = PropTypes.shape({
  main: PropTypes.bool,
  appointments: PropTypes.bool,
  messages: PropTypes.bool,
  results: PropTypes.bool,
  nearby: PropTypes.bool,
  sendingMessage: PropTypes.bool,
  cancelingAppointment: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null])
  ]),
});

// Default props for components
export const defaultProps = {
  appointments: [],
  messages: [],
  results: [],
  nearbyCenters: [],
  isLoading: {
    main: false,
    appointments: false,
    messages: false,
    results: false,
    nearby: false,
    sendingMessage: false,
    cancelingAppointment: null,
  },
  onCancelAppointment: () => {},
  onSendMessage: () => {},
  onViewMessage: () => {},
  onCenterClick: () => {},
};

// Prop types for the main PatientDashboard component
export const PatientDashboardPropTypes = {
  initialTab: PropTypes.oneOf(['overview', 'appointments', 'messages', 'results', 'nearby']),
  user: UserType,
  appointments: PropTypes.arrayOf(AppointmentType),
  messages: PropTypes.arrayOf(MessageType),
  results: PropTypes.arrayOf(ResultType),
  nearbyCenters: PropTypes.arrayOf(CenterType),
  userPosition: PositionType,
  isLoading: LoadingStateType,
  onCancelAppointment: PropTypes.func,
  onSendMessage: PropTypes.func,
  onViewMessage: PropTypes.func,
  onCenterClick: PropTypes.func,
};

// Prop types for tab components
export const OverviewTabPropTypes = {
  upcomingAppointments: PropTypes.arrayOf(AppointmentType),
  pastAppointments: PropTypes.arrayOf(AppointmentType),
  messages: PropTypes.arrayOf(MessageType),
  onViewMessage: PropTypes.func,
  onComposeMessage: PropTypes.func,
  onCancelAppointment: PropTypes.func,
  isLoading: LoadingStateType,
  t: PropTypes.func.isRequired,
};

export const AppointmentsTabPropTypes = {
  upcomingAppointments: PropTypes.arrayOf(AppointmentType),
  pastAppointments: PropTypes.arrayOf(AppointmentType),
  onCancelAppointment: PropTypes.func,
  isLoading: PropTypes.bool,
  isCanceling: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  t: PropTypes.func.isRequired,
  isRTL: PropTypes.bool,
};

export const MessagesTabPropTypes = {
  messages: PropTypes.arrayOf(MessageType),
  onViewMessage: PropTypes.func,
  onComposeMessage: PropTypes.func,
  isLoading: PropTypes.bool,
  t: PropTypes.func.isRequired,
  isRTL: PropTypes.bool,
};

export const ResultsTabPropTypes = {
  results: PropTypes.arrayOf(ResultType),
  onViewResult: PropTypes.func,
  isLoading: PropTypes.bool,
  t: PropTypes.func.isRequired,
  isRTL: PropTypes.bool,
};

export const NearbyTabPropTypes = {
  nearbyCenters: PropTypes.arrayOf(CenterType),
  userPosition: PositionType,
  onCenterClick: PropTypes.func,
  isLoading: PropTypes.bool,
  t: PropTypes.func.isRequired,
  mapKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isRTL: PropTypes.bool,
};
