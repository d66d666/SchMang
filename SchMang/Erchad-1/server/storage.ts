import type {
  Student, InsertStudent,
  Group, InsertGroup,
  SpecialStatus, InsertSpecialStatus,
  Teacher, InsertTeacher,
  TeacherGroup, InsertTeacherGroup,
  StudentVisit, InsertStudentVisit,
  StudentPermission, InsertStudentPermission,
  StudentViolation, InsertStudentViolation,
  TeacherProfile, InsertTeacherProfile,
  LoginCredentials, InsertLoginCredentials
} from "../shared/schema.js";

export interface IStorage {
  // Groups
  getGroups(): Promise<Group[]>;
  getGroupById(id: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: string, group: Partial<InsertGroup>): Promise<Group | undefined>;
  deleteGroup(id: string): Promise<boolean>;

  // Special Statuses
  getSpecialStatuses(): Promise<SpecialStatus[]>;
  getSpecialStatusById(id: string): Promise<SpecialStatus | undefined>;
  createSpecialStatus(status: InsertSpecialStatus): Promise<SpecialStatus>;
  updateSpecialStatus(id: string, status: Partial<InsertSpecialStatus>): Promise<SpecialStatus | undefined>;
  deleteSpecialStatus(id: string): Promise<boolean>;

  // Students
  getStudents(): Promise<Student[]>;
  getStudentById(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  createManyStudents(students: InsertStudent[]): Promise<Student[]>;

  // Teachers
  getTeachers(): Promise<Teacher[]>;
  getTeacherById(id: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: string): Promise<boolean>;

  // Teacher Groups
  getTeacherGroups(): Promise<TeacherGroup[]>;
  getTeacherGroupsByTeacherId(teacherId: string): Promise<TeacherGroup[]>;
  createTeacherGroup(teacherGroup: InsertTeacherGroup): Promise<TeacherGroup>;
  deleteTeacherGroup(id: string): Promise<boolean>;

  // Student Visits
  getStudentVisits(): Promise<StudentVisit[]>;
  getStudentVisitsByStudentId(studentId: string): Promise<StudentVisit[]>;
  createStudentVisit(visit: InsertStudentVisit): Promise<StudentVisit>;
  deleteStudentVisit(id: string): Promise<boolean>;

  // Student Permissions
  getStudentPermissions(): Promise<StudentPermission[]>;
  getStudentPermissionsByStudentId(studentId: string): Promise<StudentPermission[]>;
  createStudentPermission(permission: InsertStudentPermission): Promise<StudentPermission>;
  deleteStudentPermission(id: string): Promise<boolean>;

  // Student Violations
  getStudentViolations(): Promise<StudentViolation[]>;
  getStudentViolationsByStudentId(studentId: string): Promise<StudentViolation[]>;
  createStudentViolation(violation: InsertStudentViolation): Promise<StudentViolation>;
  deleteStudentViolation(id: string): Promise<boolean>;

  // Teacher Profile
  getTeacherProfile(): Promise<TeacherProfile | undefined>;
  createOrUpdateTeacherProfile(profile: InsertTeacherProfile): Promise<TeacherProfile>;

  // Login Credentials
  getLoginCredentials(username: string): Promise<LoginCredentials | undefined>;
  createLoginCredentials(credentials: InsertLoginCredentials): Promise<LoginCredentials>;
  updateLoginCredentials(id: string, credentials: Partial<InsertLoginCredentials>): Promise<LoginCredentials | undefined>;
  
  // Password Reset
  createPasswordResetToken(username: string): Promise<{ token: string, expiresAt: string } | null>;
  verifyPasswordResetToken(username: string, token: string): Promise<boolean>;
  resetPassword(username: string, token: string, newPassword: string): Promise<boolean>;

  // Clear Database
  clearDatabase(): Promise<void>;
}
