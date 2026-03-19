export interface Student {
  id: string;
  name: string;
  admissionNo: string;
  grade: string;
  section: string;
  gender: "Male" | "Female";
  parentName: string;
  phone: string;
  status: "Active" | "Inactive" | "Transferred";
  dateOfBirth: string;
  admissionDate: string;
}

export const mockStudents: Student[] = [
  { id: "1", name: "Kipchirchir Brian", admissionNo: "MOT-2024-001", grade: "Form 3", section: "East", gender: "Male", parentName: "Joseph Kipchirchir", phone: "0712345678", status: "Active", dateOfBirth: "2008-03-15", admissionDate: "2022-01-10" },
  { id: "2", name: "Chebet Faith", admissionNo: "MOT-2024-002", grade: "Form 2", section: "West", gender: "Female", parentName: "Mary Chebet", phone: "0723456789", status: "Active", dateOfBirth: "2009-07-22", admissionDate: "2023-01-09" },
  { id: "3", name: "Kipruto Dennis", admissionNo: "MOT-2024-003", grade: "Form 4", section: "East", gender: "Male", parentName: "Peter Kipruto", phone: "0734567890", status: "Active", dateOfBirth: "2007-11-05", admissionDate: "2021-01-11" },
  { id: "4", name: "Jepkosgei Mercy", admissionNo: "MOT-2024-004", grade: "Class 8", section: "North", gender: "Female", parentName: "Ruth Jepkosgei", phone: "0745678901", status: "Active", dateOfBirth: "2012-01-30", admissionDate: "2020-01-13" },
  { id: "5", name: "Korir Emmanuel", admissionNo: "MOT-2024-005", grade: "Form 1", section: "West", gender: "Male", parentName: "David Korir", phone: "0756789012", status: "Inactive", dateOfBirth: "2010-09-18", admissionDate: "2024-01-08" },
  { id: "6", name: "Chepkemoi Alice", admissionNo: "MOT-2024-006", grade: "Class 7", section: "South", gender: "Female", parentName: "Grace Chepkemoi", phone: "0767890123", status: "Active", dateOfBirth: "2013-04-12", admissionDate: "2019-01-14" },
  { id: "7", name: "Kiplagat Victor", admissionNo: "MOT-2024-007", grade: "Form 3", section: "East", gender: "Male", parentName: "Samuel Kiplagat", phone: "0778901234", status: "Active", dateOfBirth: "2008-06-25", admissionDate: "2022-01-10" },
  { id: "8", name: "Jeptoo Sharon", admissionNo: "MOT-2024-008", grade: "Class 6", section: "North", gender: "Female", parentName: "Ann Jeptoo", phone: "0789012345", status: "Transferred", dateOfBirth: "2014-12-03", admissionDate: "2020-01-13" },
  { id: "9", name: "Mutai Collins", admissionNo: "MOT-2024-009", grade: "Form 2", section: "West", gender: "Male", parentName: "John Mutai", phone: "0790123456", status: "Active", dateOfBirth: "2009-08-14", admissionDate: "2023-01-09" },
  { id: "10", name: "Chepng'etich Janet", admissionNo: "MOT-2024-010", grade: "Class 5", section: "South", gender: "Female", parentName: "Elizabeth Chepng'etich", phone: "0701234567", status: "Active", dateOfBirth: "2015-02-28", admissionDate: "2021-01-11" },
];
