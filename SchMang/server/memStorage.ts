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
import type { IStorage } from "./storage.js";

export class MemStorage implements IStorage {
  private groups: Map<string, Group> = new Map();
  private specialStatuses: Map<string, SpecialStatus> = new Map();
  private students: Map<string, Student> = new Map();
  private teachers: Map<string, Teacher> = new Map();
  private teacherGroups: Map<string, TeacherGroup> = new Map();
  private studentVisits: Map<string, StudentVisit> = new Map();
  private studentPermissions: Map<string, StudentPermission> = new Map();
  private studentViolations: Map<string, StudentViolation> = new Map();
  private teacherProfileData: TeacherProfile | undefined = undefined;
  private credentials: Map<string, LoginCredentials> = new Map();

  // Groups
  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values()).sort((a, b) => {
      if (a.stage !== b.stage) return a.stage.localeCompare(b.stage);
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  }

  async getGroupById(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const newGroup: Group = { 
      id,
      name: group.name,
      stage: group.stage,
      displayOrder: group.displayOrder || null,
      createdAt
    };
    this.groups.set(id, newGroup);
    return newGroup;
  }

  async updateGroup(id: string, group: Partial<InsertGroup>): Promise<Group | undefined> {
    const existing = this.groups.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...group };
    this.groups.set(id, updated);
    return updated;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const deleted = this.groups.delete(id);
    if (deleted) {
      // إزالة ارتباط الطلاب بالمجموعة
      for (const [studentId, student] of this.students.entries()) {
        if (student.groupId === id) {
          this.students.set(studentId, { ...student, groupId: null });
        }
      }
      // إزالة ارتباط المعلمين بالمجموعة
      for (const [tgId, tg] of this.teacherGroups.entries()) {
        if (tg.groupId === id) {
          this.teacherGroups.delete(tgId);
        }
      }
    }
    return deleted;
  }

  // Special Statuses
  async getSpecialStatuses(): Promise<SpecialStatus[]> {
    return Array.from(this.specialStatuses.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getSpecialStatusById(id: string): Promise<SpecialStatus | undefined> {
    return this.specialStatuses.get(id);
  }

  async createSpecialStatus(status: InsertSpecialStatus): Promise<SpecialStatus> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const newStatus: SpecialStatus = { ...status, id, createdAt };
    this.specialStatuses.set(id, newStatus);
    return newStatus;
  }

  async updateSpecialStatus(id: string, status: Partial<InsertSpecialStatus>): Promise<SpecialStatus | undefined> {
    const existing = this.specialStatuses.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...status };
    this.specialStatuses.set(id, updated);
    return updated;
  }

  async deleteSpecialStatus(id: string): Promise<boolean> {
    return this.specialStatuses.delete(id);
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newStudent: Student = { 
      name: student.name,
      nationalId: student.nationalId,
      phone: student.phone,
      guardianPhone: student.guardianPhone,
      grade: student.grade,
      groupId: student.groupId || null,
      status: student.status || 'نشط',
      specialStatusId: student.specialStatusId || null,
      visitCount: student.visitCount || 0,
      permissionCount: student.permissionCount || 0,
      violationCount: student.violationCount || 0,
      id, 
      createdAt: now, 
      updatedAt: now
    };
    this.students.set(id, newStudent);
    return newStudent;
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const existing = this.students.get(id);
    if (!existing) return undefined;
    const now = new Date();
    const updated = { ...existing, ...student, updatedAt: now };
    this.students.set(id, updated);
    return updated;
  }

  async deleteStudent(id: string): Promise<boolean> {
    return this.students.delete(id);
  }

  async createManyStudents(studentsData: InsertStudent[]): Promise<Student[]> {
    const now = new Date();
    const newStudents = studentsData.map(s => {
      const id = crypto.randomUUID();
      const student: Student = {
        name: s.name,
        nationalId: s.nationalId,
        phone: s.phone,
        guardianPhone: s.guardianPhone,
        grade: s.grade,
        groupId: s.groupId || null,
        status: s.status || 'نشط',
        specialStatusId: s.specialStatusId || null,
        visitCount: s.visitCount || 0,
        permissionCount: s.permissionCount || 0,
        violationCount: s.violationCount || 0,
        id,
        createdAt: now,
        updatedAt: now
      };
      this.students.set(id, student);
      return student;
    });
    return newStudents;
  }

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getTeacherById(id: string): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newTeacher: Teacher = { ...teacher, id, createdAt: now, updatedAt: now };
    this.teachers.set(id, newTeacher);
    return newTeacher;
  }

  async updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const existing = this.teachers.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...teacher };
    this.teachers.set(id, updated);
    return updated;
  }

  async deleteTeacher(id: string): Promise<boolean> {
    return this.teachers.delete(id);
  }

  // Teacher Groups
  async getTeacherGroups(): Promise<TeacherGroup[]> {
    return Array.from(this.teacherGroups.values());
  }

  async getTeacherGroupsByTeacherId(teacherId: string): Promise<TeacherGroup[]> {
    return Array.from(this.teacherGroups.values()).filter(tg => tg.teacherId === teacherId);
  }

  async createTeacherGroup(teacherGroup: InsertTeacherGroup): Promise<TeacherGroup> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const newTG: TeacherGroup = { 
      id, 
      teacherId: teacherGroup.teacherId || null,
      groupId: teacherGroup.groupId || null,
      createdAt
    };
    this.teacherGroups.set(id, newTG);
    return newTG;
  }

  async deleteTeacherGroup(id: string): Promise<boolean> {
    return this.teacherGroups.delete(id);
  }

  // Student Visits
  async getStudentVisits(): Promise<StudentVisit[]> {
    return Array.from(this.studentVisits.values()).sort((a, b) => 
      new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
  }

  async getStudentVisitsByStudentId(studentId: string): Promise<StudentVisit[]> {
    return Array.from(this.studentVisits.values())
      .filter(v => v.studentId === studentId)
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
  }

  async createStudentVisit(visit: InsertStudentVisit): Promise<StudentVisit> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const newVisit: StudentVisit = { 
      id,
      studentId: visit.studentId || null,
      visitDate: visit.visitDate,
      reason: visit.reason,
      actionTaken: visit.actionTaken,
      referredTo: visit.referredTo || 'لا يوجد',
      notes: visit.notes || null,
      createdAt
    };
    this.studentVisits.set(id, newVisit);
    
    // تحديث عداد الزيارات للطالب
    if (visit.studentId) {
      const student = this.students.get(visit.studentId);
      if (student) {
        this.students.set(visit.studentId, {
          ...student,
          visitCount: (student.visitCount || 0) + 1
        });
      }
    }
    
    return newVisit;
  }

  async deleteStudentVisit(id: string): Promise<boolean> {
    const visit = this.studentVisits.get(id);
    const deleted = this.studentVisits.delete(id);
    
    if (deleted && visit && visit.studentId) {
      // تحديث عداد الزيارات للطالب
      const student = this.students.get(visit.studentId);
      if (student && (student.visitCount || 0) > 0) {
        this.students.set(visit.studentId, {
          ...student,
          visitCount: (student.visitCount || 1) - 1
        });
      }
    }
    
    return deleted;
  }

  // Student Permissions
  async getStudentPermissions(): Promise<StudentPermission[]> {
    return Array.from(this.studentPermissions.values()).sort((a, b) => 
      new Date(b.permissionDate).getTime() - new Date(a.permissionDate).getTime()
    );
  }

  async getStudentPermissionsByStudentId(studentId: string): Promise<StudentPermission[]> {
    return Array.from(this.studentPermissions.values())
      .filter(p => p.studentId === studentId)
      .sort((a, b) => new Date(b.permissionDate).getTime() - new Date(a.permissionDate).getTime());
  }

  async createStudentPermission(permission: InsertStudentPermission): Promise<StudentPermission> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const newPermission: StudentPermission = { 
      id,
      studentId: permission.studentId || null,
      permissionDate: permission.permissionDate,
      exitTime: permission.exitTime || null,
      reason: permission.reason,
      guardianNotified: permission.guardianNotified || null,
      notes: permission.notes || null,
      createdAt
    };
    this.studentPermissions.set(id, newPermission);
    
    // تحديث عداد الاستئذانات للطالب
    if (permission.studentId) {
      const student = this.students.get(permission.studentId);
      if (student) {
        this.students.set(permission.studentId, {
          ...student,
          permissionCount: (student.permissionCount || 0) + 1
        });
      }
    }
    
    return newPermission;
  }

  async deleteStudentPermission(id: string): Promise<boolean> {
    const permission = this.studentPermissions.get(id);
    const deleted = this.studentPermissions.delete(id);
    
    if (deleted && permission && permission.studentId) {
      // تحديث عداد الاستئذانات للطالب
      const student = this.students.get(permission.studentId);
      if (student && (student.permissionCount || 0) > 0) {
        this.students.set(permission.studentId, {
          ...student,
          permissionCount: (student.permissionCount || 1) - 1
        });
      }
    }
    
    return deleted;
  }

  // Student Violations
  async getStudentViolations(): Promise<StudentViolation[]> {
    return Array.from(this.studentViolations.values()).sort((a, b) => 
      new Date(b.violationDate).getTime() - new Date(a.violationDate).getTime()
    );
  }

  async getStudentViolationsByStudentId(studentId: string): Promise<StudentViolation[]> {
    return Array.from(this.studentViolations.values())
      .filter(v => v.studentId === studentId)
      .sort((a, b) => new Date(b.violationDate).getTime() - new Date(a.violationDate).getTime());
  }

  async createStudentViolation(violation: InsertStudentViolation): Promise<StudentViolation> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const newViolation: StudentViolation = { 
      id,
      studentId: violation.studentId || null,
      violationDate: violation.violationDate,
      violationType: violation.violationType,
      description: violation.description || null,
      actionTaken: violation.actionTaken || null,
      notes: violation.notes || null,
      createdAt
    };
    this.studentViolations.set(id, newViolation);
    
    // تحديث عداد المخالفات للطالب
    if (violation.studentId) {
      const student = this.students.get(violation.studentId);
      if (student) {
        this.students.set(violation.studentId, {
          ...student,
          violationCount: (student.violationCount || 0) + 1
        });
      }
    }
    
    return newViolation;
  }

  async deleteStudentViolation(id: string): Promise<boolean> {
    const violation = this.studentViolations.get(id);
    const deleted = this.studentViolations.delete(id);
    
    if (deleted && violation && violation.studentId) {
      // تحديث عداد المخالفات للطالب
      const student = this.students.get(violation.studentId);
      if (student && (student.violationCount || 0) > 0) {
        this.students.set(violation.studentId, {
          ...student,
          violationCount: (student.violationCount || 1) - 1
        });
      }
    }
    
    return deleted;
  }

  // Teacher Profile
  async getTeacherProfile(): Promise<TeacherProfile | undefined> {
    return this.teacherProfileData;
  }

  async createOrUpdateTeacherProfile(profile: InsertTeacherProfile): Promise<TeacherProfile> {
    const id = this.teacherProfileData?.id || crypto.randomUUID();
    const createdAt = this.teacherProfileData?.createdAt || new Date();
    this.teacherProfileData = { 
      id,
      name: profile.name || null,
      phone: profile.phone || null,
      schoolName: profile.schoolName || null,
      systemTitle: profile.systemTitle || null,
      logoUrl: profile.logoUrl || null,
      autoLogoutMinutes: profile.autoLogoutMinutes || null,
      createdAt
    };
    return this.teacherProfileData;
  }

  // Login Credentials
  async getLoginCredentials(username: string): Promise<LoginCredentials | undefined> {
    return Array.from(this.credentials.values()).find(c => c.username === username);
  }

  async createLoginCredentials(credentials: InsertLoginCredentials): Promise<LoginCredentials> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newCredentials: LoginCredentials = { 
      id,
      username: credentials.username,
      passwordHash: credentials.passwordHash,
      resetToken: credentials.resetToken || null,
      resetTokenExpires: credentials.resetTokenExpires || null,
      createdAt: now,
      updatedAt: now
    };
    this.credentials.set(id, newCredentials);
    return newCredentials;
  }

  async updateLoginCredentials(id: string, credentials: Partial<InsertLoginCredentials>): Promise<LoginCredentials | undefined> {
    const existing = this.credentials.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...credentials };
    this.credentials.set(id, updated);
    return updated;
  }

  // Password Reset
  async createPasswordResetToken(username: string): Promise<{ token: string, expiresAt: string } | null> {
    const credential = Array.from(this.credentials.values()).find(c => c.username === username);
    if (!credential) return null;

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    this.credentials.set(credential.id, {
      ...credential,
      resetToken: token,
      resetTokenExpires: expiresAt
    });

    return { token, expiresAt };
  }

  async verifyPasswordResetToken(username: string, token: string): Promise<boolean> {
    const credential = Array.from(this.credentials.values()).find(c => c.username === username);
    if (!credential || !credential.resetToken || !credential.resetTokenExpires) return false;

    const isValid = credential.resetToken === token && 
                   new Date(credential.resetTokenExpires) > new Date();
    return isValid;
  }

  async resetPassword(username: string, token: string, newPassword: string): Promise<boolean> {
    const isValid = await this.verifyPasswordResetToken(username, token);
    if (!isValid) return false;

    const credential = Array.from(this.credentials.values()).find(c => c.username === username);
    if (!credential) return false;

    this.credentials.set(credential.id, {
      ...credential,
      passwordHash: newPassword,
      resetToken: null,
      resetTokenExpires: null
    });

    return true;
  }

  // Clear Database
  async clearDatabase(): Promise<void> {
    this.students.clear();
    this.teachers.clear();
    this.groups.clear();
    this.teacherGroups.clear();
    this.studentVisits.clear();
    this.studentPermissions.clear();
    this.studentViolations.clear();
    this.specialStatuses.clear();
    this.credentials.clear();
    this.teacherProfileData = undefined;
  }

  // Import Data (preserves IDs)
  async importData(data: any): Promise<void> {
    try {
      // استيراد الملف الشخصي
      if (data.profile) {
        this.teacherProfileData = data.profile;
      }

      // إنشاء حساب admin افتراضي
      const adminId = crypto.randomUUID();
      const now = new Date();
      this.credentials.set(adminId, {
        id: adminId,
        username: 'admin',
        passwordHash: 'admin123',
        resetToken: null,
        resetTokenExpires: null,
        createdAt: now,
        updatedAt: now
      });

      // استيراد الحالات الخاصة
      if (data.special_statuses && Array.isArray(data.special_statuses)) {
        for (const status of data.special_statuses) {
          if (!status || !status.id) {
            throw new Error('Invalid special status record: missing id');
          }
          this.specialStatuses.set(status.id, status);
        }
      }

      // استيراد المجموعات
      if (data.groups && Array.isArray(data.groups)) {
        for (const group of data.groups) {
          if (!group || !group.id) {
            throw new Error('Invalid group record: missing id');
          }
          this.groups.set(group.id, group);
        }
      }

      // استيراد الطلاب
      if (data.students && Array.isArray(data.students)) {
        for (const student of data.students) {
          if (!student || !student.id) {
            throw new Error('Invalid student record: missing id');
          }
          this.students.set(student.id, student);
        }
      }

      // استيراد المعلمين
      if (data.teachers && Array.isArray(data.teachers)) {
        for (const teacher of data.teachers) {
          if (!teacher || !teacher.id) {
            throw new Error('Invalid teacher record: missing id');
          }
          this.teachers.set(teacher.id, teacher);
        }
      }

      // استيراد ربط المعلمين بالمجموعات
      if (data.teacher_groups && Array.isArray(data.teacher_groups)) {
        for (const tg of data.teacher_groups) {
          if (!tg || !tg.id) {
            throw new Error('Invalid teacher_group record: missing id');
          }
          this.teacherGroups.set(tg.id, tg);
        }
      }

      // استيراد الزيارات
      if (data.visits && Array.isArray(data.visits)) {
        for (const visit of data.visits) {
          if (!visit || !visit.id) {
            throw new Error('Invalid visit record: missing id');
          }
          this.studentVisits.set(visit.id, visit);
        }
      }

      // استيراد الاستئذانات
      if (data.permissions && Array.isArray(data.permissions)) {
        for (const permission of data.permissions) {
          if (!permission || !permission.id) {
            throw new Error('Invalid permission record: missing id');
          }
          this.studentPermissions.set(permission.id, permission);
        }
      }

      // استيراد المخالفات
      if (data.violations && Array.isArray(data.violations)) {
        for (const violation of data.violations) {
          if (!violation || !violation.id) {
            throw new Error('Invalid violation record: missing id');
          }
          this.studentViolations.set(violation.id, violation);
        }
      }
    } catch (error) {
      // في حالة حدوث خطأ، سيتم رمي exception لـ endpoint
      throw error;
    }
  }
}

export const storage = new MemStorage();
