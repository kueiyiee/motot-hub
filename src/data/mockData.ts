export interface Student {
  id: string;
  name: string;
  admissionNo: string;
  grade: string;
  section: string;
  gender: "Male" | "Female";
  parentName: string;
  phone: string;
  email?: string;
  status: "Active" | "Inactive" | "Transferred" | "Graduated";
  dateOfBirth: string;
  admissionDate: string;
  address?: string;
  bloodGroup?: string;
  photoUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  subject: string;
  classes: string;
  qualification: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Resigned";
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  grade: string;
  teacherId: string;
  teacherName: string;
  credits: number;
  enrolledCount: number;
  schedule: string;
  status: "Active" | "Archived";
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  grade: string;
  term: string;
  year: string;
  score: number;
  maxScore: number;
  gpa: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  courseId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
}

export const mockStudents: Student[] = [
  { id: "1", name: "Kipchirchir Brian", admissionNo: "MOT-2024-001", grade: "Form 3", section: "East", gender: "Male", parentName: "Joseph Kipchirchir", phone: "0712345678", email: "brian@student.motot.ac.ke", status: "Active", dateOfBirth: "2008-03-15", admissionDate: "2022-01-10", address: "Nandi Hills", bloodGroup: "O+" },
  { id: "2", name: "Chebet Faith", admissionNo: "MOT-2024-002", grade: "Form 2", section: "West", gender: "Female", parentName: "Mary Chebet", phone: "0723456789", status: "Active", dateOfBirth: "2009-07-22", admissionDate: "2023-01-09", address: "Kapsabet" },
  { id: "3", name: "Kipruto Dennis", admissionNo: "MOT-2024-003", grade: "Form 4", section: "East", gender: "Male", parentName: "Peter Kipruto", phone: "0734567890", status: "Active", dateOfBirth: "2007-11-05", admissionDate: "2021-01-11" },
  { id: "4", name: "Jepkosgei Mercy", admissionNo: "MOT-2024-004", grade: "Class 8", section: "North", gender: "Female", parentName: "Ruth Jepkosgei", phone: "0745678901", status: "Active", dateOfBirth: "2012-01-30", admissionDate: "2020-01-13" },
  { id: "5", name: "Korir Emmanuel", admissionNo: "MOT-2024-005", grade: "Form 1", section: "West", gender: "Male", parentName: "David Korir", phone: "0756789012", status: "Inactive", dateOfBirth: "2010-09-18", admissionDate: "2024-01-08" },
  { id: "6", name: "Chepkemoi Alice", admissionNo: "MOT-2024-006", grade: "Class 7", section: "South", gender: "Female", parentName: "Grace Chepkemoi", phone: "0767890123", status: "Active", dateOfBirth: "2013-04-12", admissionDate: "2019-01-14" },
  { id: "7", name: "Kiplagat Victor", admissionNo: "MOT-2024-007", grade: "Form 3", section: "East", gender: "Male", parentName: "Samuel Kiplagat", phone: "0778901234", status: "Active", dateOfBirth: "2008-06-25", admissionDate: "2022-01-10" },
  { id: "8", name: "Jeptoo Sharon", admissionNo: "MOT-2024-008", grade: "Class 6", section: "North", gender: "Female", parentName: "Ann Jeptoo", phone: "0789012345", status: "Transferred", dateOfBirth: "2014-12-03", admissionDate: "2020-01-13" },
  { id: "9", name: "Mutai Collins", admissionNo: "MOT-2024-009", grade: "Form 2", section: "West", gender: "Male", parentName: "John Mutai", phone: "0790123456", status: "Active", dateOfBirth: "2009-08-14", admissionDate: "2023-01-09" },
  { id: "10", name: "Chepng'etich Janet", admissionNo: "MOT-2024-010", grade: "Class 5", section: "South", gender: "Female", parentName: "Elizabeth Chepng'etich", phone: "0701234567", status: "Active", dateOfBirth: "2015-02-28", admissionDate: "2021-01-11" },
  { id: "11", name: "Bett Kelvin", admissionNo: "MOT-2024-011", grade: "Form 1", section: "East", gender: "Male", parentName: "James Bett", phone: "0711223344", status: "Active", dateOfBirth: "2010-05-20", admissionDate: "2024-01-08" },
  { id: "12", name: "Sang Lydia", admissionNo: "MOT-2024-012", grade: "Form 4", section: "West", gender: "Female", parentName: "Sarah Sang", phone: "0722334455", status: "Active", dateOfBirth: "2007-09-11", admissionDate: "2021-01-11" },
];

export const mockTeachers: Teacher[] = [
  { id: "t1", name: "Mr. Kiprop Elijah", employeeId: "EMP-001", email: "kiprop@motot.ac.ke", phone: "0712000001", subject: "Mathematics", classes: "Form 3, Form 4", qualification: "B.Ed Mathematics", joinDate: "2018-01-15", status: "Active" },
  { id: "t2", name: "Mrs. Chepkoech Rose", employeeId: "EMP-002", email: "chepkoech@motot.ac.ke", phone: "0712000002", subject: "English", classes: "Form 1, Form 2", qualification: "B.Ed English", joinDate: "2019-03-01", status: "Active" },
  { id: "t3", name: "Mr. Rotich Daniel", employeeId: "EMP-003", email: "rotich@motot.ac.ke", phone: "0712000003", subject: "Physics", classes: "Form 3, Form 4", qualification: "B.Sc Physics", joinDate: "2017-09-01", status: "Active" },
  { id: "t4", name: "Ms. Jepchirchir Linet", employeeId: "EMP-004", email: "jepchirchir@motot.ac.ke", phone: "0712000004", subject: "Biology", classes: "Form 2, Form 3", qualification: "B.Sc Biology", joinDate: "2020-01-10", status: "On Leave" },
  { id: "t5", name: "Mr. Langat Stephen", employeeId: "EMP-005", email: "langat@motot.ac.ke", phone: "0712000005", subject: "Kiswahili", classes: "Class 7, Class 8", qualification: "B.Ed Kiswahili", joinDate: "2016-05-20", status: "Active" },
  { id: "t6", name: "Mrs. Kosgei Gladys", employeeId: "EMP-006", email: "kosgei@motot.ac.ke", phone: "0712000006", subject: "Social Studies", classes: "Class 5, Class 6", qualification: "B.Ed Social Studies", joinDate: "2021-01-08", status: "Active" },
  { id: "t7", name: "Mr. Cheruiyot Paul", employeeId: "EMP-007", email: "cheruiyot@motot.ac.ke", phone: "0712000007", subject: "Chemistry", classes: "Form 3, Form 4", qualification: "B.Sc Chemistry", joinDate: "2019-09-01", status: "Active" },
  { id: "t8", name: "Mrs. Too Milka", employeeId: "EMP-008", email: "too@motot.ac.ke", phone: "0712000008", subject: "History", classes: "Form 1, Form 2", qualification: "B.A History", joinDate: "2018-05-15", status: "Active" },
];

export const mockCourses: Course[] = [
  { id: "c1", code: "MAT-301", name: "Mathematics", description: "Advanced algebra and geometry", grade: "Form 3", teacherId: "t1", teacherName: "Mr. Kiprop Elijah", credits: 5, enrolledCount: 42, schedule: "Mon, Wed, Fri 8:00-9:00", status: "Active" },
  { id: "c2", code: "ENG-201", name: "English Language", description: "Grammar, composition and literature", grade: "Form 2", teacherId: "t2", teacherName: "Mrs. Chepkoech Rose", credits: 5, enrolledCount: 38, schedule: "Tue, Thu 10:00-11:30", status: "Active" },
  { id: "c3", code: "PHY-401", name: "Physics", description: "Mechanics and electromagnetism", grade: "Form 4", teacherId: "t3", teacherName: "Mr. Rotich Daniel", credits: 4, enrolledCount: 35, schedule: "Mon, Wed 10:00-11:00", status: "Active" },
  { id: "c4", code: "BIO-301", name: "Biology", description: "Human anatomy and ecology", grade: "Form 3", teacherId: "t4", teacherName: "Ms. Jepchirchir Linet", credits: 4, enrolledCount: 40, schedule: "Tue, Thu 8:00-9:30", status: "Active" },
  { id: "c5", code: "KIS-701", name: "Kiswahili", description: "Advanced Kiswahili grammar", grade: "Class 7", teacherId: "t5", teacherName: "Mr. Langat Stephen", credits: 3, enrolledCount: 30, schedule: "Mon, Fri 11:00-12:00", status: "Active" },
  { id: "c6", code: "CHE-401", name: "Chemistry", description: "Organic and inorganic chemistry", grade: "Form 4", teacherId: "t7", teacherName: "Mr. Cheruiyot Paul", credits: 4, enrolledCount: 33, schedule: "Wed, Fri 10:00-11:30", status: "Active" },
  { id: "c7", code: "HIS-101", name: "History", description: "East African History", grade: "Form 1", teacherId: "t8", teacherName: "Mrs. Too Milka", credits: 3, enrolledCount: 45, schedule: "Tue, Thu 14:00-15:00", status: "Active" },
  { id: "c8", code: "SST-501", name: "Social Studies", description: "Geography and civics", grade: "Class 5", teacherId: "t6", teacherName: "Mrs. Kosgei Gladys", credits: 3, enrolledCount: 28, schedule: "Mon, Wed 14:00-15:00", status: "Active" },
];

export const mockGrades: GradeRecord[] = [
  { id: "g1", studentId: "1", studentName: "Kipchirchir Brian", courseId: "c1", courseName: "Mathematics", grade: "Form 3", term: "Term 1", year: "2024", score: 78, maxScore: 100, gpa: 3.2 },
  { id: "g2", studentId: "1", studentName: "Kipchirchir Brian", courseId: "c4", courseName: "Biology", grade: "Form 3", term: "Term 1", year: "2024", score: 82, maxScore: 100, gpa: 3.5 },
  { id: "g3", studentId: "2", studentName: "Chebet Faith", courseId: "c2", courseName: "English Language", grade: "Form 2", term: "Term 1", year: "2024", score: 90, maxScore: 100, gpa: 4.0 },
  { id: "g4", studentId: "2", studentName: "Chebet Faith", courseId: "c1", courseName: "Mathematics", grade: "Form 2", term: "Term 1", year: "2024", score: 85, maxScore: 100, gpa: 3.7 },
  { id: "g5", studentId: "3", studentName: "Kipruto Dennis", courseId: "c3", courseName: "Physics", grade: "Form 4", term: "Term 1", year: "2024", score: 88, maxScore: 100, gpa: 3.8 },
  { id: "g6", studentId: "3", studentName: "Kipruto Dennis", courseId: "c6", courseName: "Chemistry", grade: "Form 4", term: "Term 1", year: "2024", score: 92, maxScore: 100, gpa: 4.0 },
  { id: "g7", studentId: "7", studentName: "Kiplagat Victor", courseId: "c1", courseName: "Mathematics", grade: "Form 3", term: "Term 1", year: "2024", score: 70, maxScore: 100, gpa: 2.8 },
  { id: "g8", studentId: "9", studentName: "Mutai Collins", courseId: "c2", courseName: "English Language", grade: "Form 2", term: "Term 1", year: "2024", score: 82, maxScore: 100, gpa: 3.5 },
  { id: "g9", studentId: "5", studentName: "Korir Emmanuel", courseId: "c7", courseName: "History", grade: "Form 1", term: "Term 1", year: "2024", score: 60, maxScore: 100, gpa: 2.0 },
  { id: "g10", studentId: "12", studentName: "Sang Lydia", courseId: "c3", courseName: "Physics", grade: "Form 4", term: "Term 1", year: "2024", score: 95, maxScore: 100, gpa: 4.0 },
];

export const mockAuditLogs: AuditLog[] = [
  { id: "a1", userId: "1", userName: "Admin User", action: "CREATE", target: "Student", details: "Enrolled new student: Bett Kelvin (MOT-2024-011)", timestamp: "2024-03-15T10:30:00Z" },
  { id: "a2", userId: "1", userName: "Admin User", action: "UPDATE", target: "Settings", details: "Updated school motto", timestamp: "2024-03-15T09:15:00Z" },
  { id: "a3", userId: "3", userName: "Mr. Kiprop Elijah", action: "UPDATE", target: "Grades", details: "Updated Form 3 Mathematics grades", timestamp: "2024-03-14T14:20:00Z" },
  { id: "a4", userId: "2", userName: "Jane Registrar", action: "CREATE", target: "Student", details: "Enrolled new student: Sang Lydia (MOT-2024-012)", timestamp: "2024-03-14T11:00:00Z" },
  { id: "a5", userId: "3", userName: "Mr. Kiprop Elijah", action: "UPDATE", target: "Attendance", details: "Marked attendance for Form 3 East", timestamp: "2024-03-14T08:30:00Z" },
  { id: "a6", userId: "1", userName: "Admin User", action: "DELETE", target: "Course", details: "Archived course: Art & Design", timestamp: "2024-03-13T16:45:00Z" },
  { id: "a7", userId: "1", userName: "Admin User", action: "UPDATE", target: "Teacher", details: "Updated teacher status: Ms. Jepchirchir Linet → On Leave", timestamp: "2024-03-13T10:00:00Z" },
];

export const mockNotifications: Notification[] = [
  { id: "n1", title: "New Student Enrolled", message: "Bett Kelvin has been enrolled in Form 1 East", type: "success", read: false, timestamp: "2024-03-15T10:30:00Z" },
  { id: "n2", title: "Attendance Alert", message: "5 students absent from Form 3 East today", type: "warning", read: false, timestamp: "2024-03-15T09:00:00Z" },
  { id: "n3", title: "Grades Published", message: "Term 1 grades for Form 4 have been published", type: "info", read: true, timestamp: "2024-03-14T14:20:00Z" },
  { id: "n4", title: "Teacher On Leave", message: "Ms. Jepchirchir Linet is on leave until March 25", type: "warning", read: true, timestamp: "2024-03-13T10:00:00Z" },
  { id: "n5", title: "System Update", message: "Student ID format updated successfully", type: "info", read: true, timestamp: "2024-03-12T16:00:00Z" },
];

// GPA utilities
export function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "A-";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  if (score >= 30) return "D";
  return "E";
}

export function scoreToGPA(score: number): number {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.7;
  if (score >= 70) return 3.0;
  if (score >= 60) return 2.5;
  if (score >= 50) return 2.0;
  if (score >= 40) return 1.5;
  if (score >= 30) return 1.0;
  return 0.0;
}

export function generateStudentId(format: string, year: string, seq: number): string {
  return format
    .replace("{YEAR}", year)
    .replace("{SEQ}", String(seq).padStart(3, "0"));
}
