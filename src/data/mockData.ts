import type { Building, Room, ScheduleSlot } from '../types';

export const MOCK_BUILDINGS: Building[] = [
  { id: 'bld-eng', name: 'Engineering Block', code: 'ENG', totalFloors: 4 },
  { id: 'bld-mab', name: 'Main Academic Building', code: 'MAB', totalFloors: 4 },
  { id: 'bld-sci', name: 'Science Complex', code: 'SCI', totalFloors: 3 },
  { id: 'bld-tech', name: 'Technology Hub', code: 'TECH', totalFloors: 4 },
];

export const MOCK_ROOMS: Room[] = [
  // Engineering Block (ENG)
  {
    id: 'room-eng-101',
    name: 'CR-101',
    code: 'ENG-101',
    buildingId: 'bld-eng',
    buildingName: 'Engineering Block',
    floor: 1,
    type: 'classroom',
    amenities: { seatingCapacity: 60, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-eng-102',
    name: 'CR-102',
    code: 'ENG-102',
    buildingId: 'bld-eng',
    buildingName: 'Engineering Block',
    floor: 1,
    type: 'classroom',
    amenities: { seatingCapacity: 80, hasProjector: true, hasAC: false, hasWhiteboard: true, powerOutlets: false },
  },
  {
    id: 'room-eng-201',
    name: 'Computer Lab 201',
    code: 'ENG-LAB-201',
    buildingId: 'bld-eng',
    buildingName: 'Engineering Block',
    floor: 2,
    type: 'computer_lab',
    amenities: { seatingCapacity: 45, hasProjector: true, hasAC: true, hasWhiteboard: true, computerCount: 45, powerOutlets: true },
  },
  {
    id: 'room-eng-202',
    name: 'Computer Lab 202',
    code: 'ENG-LAB-202',
    buildingId: 'bld-eng',
    buildingName: 'Engineering Block',
    floor: 2,
    type: 'computer_lab',
    amenities: { seatingCapacity: 50, hasProjector: true, hasAC: true, hasWhiteboard: true, computerCount: 50, powerOutlets: true },
  },
  {
    id: 'room-eng-301',
    name: 'Electronics Lab',
    code: 'ENG-LAB-301',
    buildingId: 'bld-eng',
    buildingName: 'Engineering Block',
    floor: 3,
    type: 'science_lab',
    amenities: { seatingCapacity: 35, hasProjector: false, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-eng-401',
    name: 'Engineering Auditorium',
    code: 'ENG-AUD-401',
    buildingId: 'bld-eng',
    buildingName: 'Engineering Block',
    floor: 4,
    type: 'seminar_hall',
    amenities: { seatingCapacity: 200, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },

  // Main Academic Building (MAB)
  {
    id: 'room-mab-001',
    name: 'Ground Lecture Hall 1',
    code: 'MAB-G01',
    buildingId: 'bld-mab',
    buildingName: 'Main Academic Building',
    floor: 0,
    type: 'classroom',
    amenities: { seatingCapacity: 120, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-mab-002',
    name: 'Ground Lecture Hall 2',
    code: 'MAB-G02',
    buildingId: 'bld-mab',
    buildingName: 'Main Academic Building',
    floor: 0,
    type: 'classroom',
    amenities: { seatingCapacity: 120, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-mab-101',
    name: 'CR-105',
    code: 'MAB-101',
    buildingId: 'bld-mab',
    buildingName: 'Main Academic Building',
    floor: 1,
    type: 'classroom',
    amenities: { seatingCapacity: 60, hasProjector: true, hasAC: false, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-mab-201',
    name: 'CAD/CAM Lab',
    code: 'MAB-LAB-201',
    buildingId: 'bld-mab',
    buildingName: 'Main Academic Building',
    floor: 2,
    type: 'computer_lab',
    amenities: { seatingCapacity: 40, hasProjector: true, hasAC: true, hasWhiteboard: true, computerCount: 40, powerOutlets: true },
  },
  {
    id: 'room-mab-301',
    name: 'Main Conference Hall',
    code: 'MAB-SEM-301',
    buildingId: 'bld-mab',
    buildingName: 'Main Academic Building',
    floor: 3,
    type: 'seminar_hall',
    amenities: { seatingCapacity: 150, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },

  // Science Complex (SCI)
  {
    id: 'room-sci-001',
    name: 'Physics Lab 1',
    code: 'SCI-PHY-01',
    buildingId: 'bld-sci',
    buildingName: 'Science Complex',
    floor: 0,
    type: 'science_lab',
    amenities: { seatingCapacity: 30, hasProjector: true, hasAC: false, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-sci-101',
    name: 'Chemistry Lab 2',
    code: 'SCI-CHM-02',
    buildingId: 'bld-sci',
    buildingName: 'Science Complex',
    floor: 1,
    type: 'science_lab',
    amenities: { seatingCapacity: 30, hasProjector: false, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-sci-102',
    name: 'Science Lecture Room A',
    code: 'SCI-LRA',
    buildingId: 'bld-sci',
    buildingName: 'Science Complex',
    floor: 1,
    type: 'classroom',
    amenities: { seatingCapacity: 75, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: false },
  },
  {
    id: 'room-sci-201',
    name: 'Biotech Research Lab',
    code: 'SCI-BIO-01',
    buildingId: 'bld-sci',
    buildingName: 'Science Complex',
    floor: 2,
    type: 'science_lab',
    amenities: { seatingCapacity: 25, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },

  // Technology Hub (TECH)
  {
    id: 'room-tech-101',
    name: 'AI & Data Science Lab',
    code: 'TECH-AI-01',
    buildingId: 'bld-tech',
    buildingName: 'Technology Hub',
    floor: 1,
    type: 'computer_lab',
    amenities: { seatingCapacity: 60, hasProjector: true, hasAC: true, hasWhiteboard: true, computerCount: 60, powerOutlets: true },
  },
  {
    id: 'room-tech-102',
    name: 'Cybersecurity Lab',
    code: 'TECH-SEC-01',
    buildingId: 'bld-tech',
    buildingName: 'Technology Hub',
    floor: 1,
    type: 'computer_lab',
    amenities: { seatingCapacity: 50, hasProjector: true, hasAC: true, hasWhiteboard: true, computerCount: 50, powerOutlets: true },
  },
  {
    id: 'room-tech-201',
    name: 'Smart Classroom T-201',
    code: 'TECH-201',
    buildingId: 'bld-tech',
    buildingName: 'Technology Hub',
    floor: 2,
    type: 'classroom',
    amenities: { seatingCapacity: 90, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },
  {
    id: 'room-tech-301',
    name: 'Tech Innovation Seminar Room',
    code: 'TECH-SEM-01',
    buildingId: 'bld-tech',
    buildingName: 'Technology Hub',
    floor: 3,
    type: 'seminar_hall',
    amenities: { seatingCapacity: 100, hasProjector: true, hasAC: true, hasWhiteboard: true, powerOutlets: true },
  },
];

export const MOCK_SCHEDULES: ScheduleSlot[] = [
  // MONDAY
  // ENG-101
  { id: 'sch-1', roomId: 'room-eng-101', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00', subjectCode: 'CS201', subjectName: 'Data Structures & Algorithms', facultyName: 'Dr. A. Sharma', batch: 'CSE-2A' },
  { id: 'sch-2', roomId: 'room-eng-101', dayOfWeek: 'Monday', startTime: '11:30', endTime: '13:00', subjectCode: 'MA202', subjectName: 'Discrete Mathematics', facultyName: 'Prof. R. Verma', batch: 'CSE-2A' },
  { id: 'sch-3', roomId: 'room-eng-101', dayOfWeek: 'Monday', startTime: '14:00', endTime: '16:00', subjectCode: 'CS203', subjectName: 'Object Oriented Programming', facultyName: 'Dr. S. Kulkarni', batch: 'CSE-2B' },

  // Computer Lab 201
  { id: 'sch-4', roomId: 'room-eng-201', dayOfWeek: 'Monday', startTime: '09:30', endTime: '12:30', subjectCode: 'CS201P', subjectName: 'Data Structures Lab', facultyName: 'Dr. A. Sharma & Team', batch: 'CSE-2A' },
  { id: 'sch-5', roomId: 'room-eng-201', dayOfWeek: 'Monday', startTime: '14:00', endTime: '17:00', subjectCode: 'CS301P', subjectName: 'Web Development Workshop', facultyName: 'Prof. M. Gupta', batch: 'IT-3A' },

  // Computer Lab 202
  { id: 'sch-6', roomId: 'room-eng-202', dayOfWeek: 'Monday', startTime: '10:00', endTime: '12:00', subjectCode: 'CS402P', subjectName: 'Cloud Computing Practical', facultyName: 'Dr. V. Rao', batch: 'CSE-4A' },
  { id: 'sch-7', roomId: 'room-eng-202', dayOfWeek: 'Monday', startTime: '13:30', endTime: '15:30', subjectCode: 'AI302P', subjectName: 'Machine Learning Lab', facultyName: 'Dr. N. Joshi', batch: 'AIML-3A' },

  // Electronics Lab
  { id: 'sch-8', roomId: 'room-eng-301', dayOfWeek: 'Monday', startTime: '09:00', endTime: '12:00', subjectCode: 'EC202P', subjectName: 'Digital Circuits Lab', facultyName: 'Prof. K. Patel', batch: 'ECE-2A' },

  // Ground Lecture Hall 1
  { id: 'sch-9', roomId: 'room-mab-001', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', subjectCode: 'HU101', subjectName: 'Professional Communication', facultyName: 'Dr. P. Nair', batch: 'FY-ALL-SEC1' },
  { id: 'sch-10', roomId: 'room-mab-001', dayOfWeek: 'Monday', startTime: '10:30', endTime: '12:00', subjectCode: 'PH101', subjectName: 'Engineering Physics', facultyName: 'Dr. B. Das', batch: 'FY-ALL-SEC1' },
  { id: 'sch-11', roomId: 'room-mab-001', dayOfWeek: 'Monday', startTime: '13:30', endTime: '15:30', subjectCode: 'CS101', subjectName: 'Introduction to Programming', facultyName: 'Dr. A. Sharma', batch: 'FY-CSE' },

  // AI Lab Tech
  { id: 'sch-12', roomId: 'room-tech-101', dayOfWeek: 'Monday', startTime: '09:00', endTime: '12:00', subjectCode: 'AI401P', subjectName: 'Deep Learning Workshop', facultyName: 'Dr. H. Kapoor', batch: 'AIML-4A' },
  { id: 'sch-13', roomId: 'room-tech-101', dayOfWeek: 'Monday', startTime: '13:30', endTime: '16:30', subjectCode: 'DS301P', subjectName: 'Big Data Analytics Lab', facultyName: 'Dr. S. Kulkarni', batch: 'DS-3A' },

  // T-201 Smart Room
  { id: 'sch-14', roomId: 'room-tech-201', dayOfWeek: 'Monday', startTime: '10:00', endTime: '11:30', subjectCode: 'CS305', subjectName: 'Database Management Systems', facultyName: 'Prof. R. Menon', batch: 'CSE-3A' },
  { id: 'sch-15', roomId: 'room-tech-201', dayOfWeek: 'Monday', startTime: '12:00', endTime: '13:30', subjectCode: 'CS306', subjectName: 'Computer Networks', facultyName: 'Dr. T. Reddy', batch: 'CSE-3B' },

  // Physics Lab 1
  { id: 'sch-16', roomId: 'room-sci-001', dayOfWeek: 'Monday', startTime: '10:00', endTime: '13:00', subjectCode: 'PH101P', subjectName: 'Physics Experiments', facultyName: 'Dr. B. Das & Team', batch: 'FY-SEC3' },

  // TUESDAY
  { id: 'sch-17', roomId: 'room-eng-101', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '10:30', subjectCode: 'CS203', subjectName: 'Object Oriented Programming', facultyName: 'Dr. S. Kulkarni', batch: 'CSE-2A' },
  { id: 'sch-18', roomId: 'room-eng-101', dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '13:00', subjectCode: 'EE201', subjectName: 'Basic Electrical Engineering', facultyName: 'Prof. S. Bose', batch: 'EE-2A' },
  { id: 'sch-19', roomId: 'room-eng-201', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '13:00', subjectCode: 'CS203P', subjectName: 'Java & OOPs Lab', facultyName: 'Dr. S. Kulkarni', batch: 'CSE-2B' },
  { id: 'sch-20', roomId: 'room-tech-102', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '12:00', subjectCode: 'SEC301P', subjectName: 'Ethical Hacking & Security', facultyName: 'Dr. A. Roy', batch: 'SEC-3A' },
  { id: 'sch-21', roomId: 'room-mab-301', dayOfWeek: 'Tuesday', startTime: '14:00', endTime: '16:00', subjectCode: 'SEM-GUEST', subjectName: 'Guest Lecture: Quantum Computing', facultyName: 'Dr. Invited Speaker', batch: 'ALL-YEARS' },

  // WEDNESDAY
  { id: 'sch-22', roomId: 'room-eng-101', dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '12:00', subjectCode: 'CS201', subjectName: 'Data Structures & Algorithms', facultyName: 'Dr. A. Sharma', batch: 'CSE-2A' },
  { id: 'sch-23', roomId: 'room-eng-201', dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '17:00', subjectCode: 'CS401P', subjectName: 'Final Year Project Mentoring', facultyName: 'All Mentors', batch: 'CSE-4A' },
  { id: 'sch-24', roomId: 'room-sci-101', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '12:00', subjectCode: 'CH101P', subjectName: 'Organic Chemistry Lab', facultyName: 'Dr. M. Sen', batch: 'CHE-1A' },
  { id: 'sch-25', roomId: 'room-mab-002', dayOfWeek: 'Wednesday', startTime: '11:00', endTime: '13:00', subjectCode: 'EC101', subjectName: 'Electronics Fundamentals', facultyName: 'Prof. K. Patel', batch: 'ECE-1A' },

  // THURSDAY
  { id: 'sch-26', roomId: 'room-eng-102', dayOfWeek: 'Thursday', startTime: '09:00', endTime: '11:00', subjectCode: 'CS304', subjectName: 'Software Engineering', facultyName: 'Prof. G. Mehta', batch: 'CSE-3A' },
  { id: 'sch-27', roomId: 'room-tech-101', dayOfWeek: 'Thursday', startTime: '10:00', endTime: '13:00', subjectCode: 'AI201P', subjectName: 'Python for AI Lab', facultyName: 'Dr. H. Kapoor', batch: 'AIML-2A' },
  { id: 'sch-28', roomId: 'room-eng-401', dayOfWeek: 'Thursday', startTime: '14:00', endTime: '16:30', subjectCode: 'AUD-TALK', subjectName: 'Industry Tech Symposium', facultyName: 'Dean Academic', batch: 'OPEN' },

  // FRIDAY
  { id: 'sch-29', roomId: 'room-eng-101', dayOfWeek: 'Friday', startTime: '09:30', endTime: '11:30', subjectCode: 'CS201', subjectName: 'Data Structures & Algorithms', facultyName: 'Dr. A. Sharma', batch: 'CSE-2A' },
  { id: 'sch-30', roomId: 'room-tech-201', dayOfWeek: 'Friday', startTime: '13:30', endTime: '15:30', subjectCode: 'CS308', subjectName: 'Compiler Design', facultyName: 'Prof. D. Mukherjee', batch: 'CSE-3B' },

  // SATURDAY
  { id: 'sch-31', roomId: 'room-eng-201', dayOfWeek: 'Saturday', startTime: '09:00', endTime: '12:00', subjectCode: 'CLUB-01', subjectName: 'Coding Club Competitive Programming', facultyName: 'Student Club Lead', batch: 'OPEN' },
  { id: 'sch-32', roomId: 'room-tech-301', dayOfWeek: 'Saturday', startTime: '10:00', endTime: '13:00', subjectCode: 'ROBOTICS', subjectName: 'Robotics & IoT Club Hands-on', facultyName: 'Prof. S. Bose', batch: 'OPEN' },
];
