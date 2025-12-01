import { db } from "./db.js";
import { eq, desc, sql } from "drizzle-orm";
import {
  students, groups, specialStatuses, teachers, teacherGroups,
  studentVisits, studentPermissions, studentViolations,
  teacherProfile, loginCredentials,
  type Student, type InsertStudent,
  type Group, type InsertGroup,
  type SpecialStatus, type InsertSpecialStatus,
  type Teacher, type InsertTeacher,
  type TeacherGroup, type InsertTeacherGroup,
  type StudentVisit, type InsertStudentVisit,
  type StudentPermission, type InsertStudentPermission,
  type StudentViolation, type InsertStudentViolation,
  type TeacherProfile, type InsertTeacherProfile,
  type LoginCredentials, type InsertLoginCredentials
} from "../shared/schema.js";
import type { IStorage } from "./storage.js";

export class DbStorage implements IStorage {
  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups).orderBy(groups.stage, groups.displayOrder);
  }

  async getGroupById(id: string): Promise<Group | undefined> {
    const result = await db.select().from(groups).where(eq(groups.id, id));
    return result[0];
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const id = crypto.randomUUID();
    const result = await db.insert(groups).values({ ...group, id }).returning();
    return result[0];
  }

  async updateGroup(id: string, group: Partial<InsertGroup>): Promise<Group | undefined> {
    const result = await db.update(groups).set(group).where(eq(groups.id, id)).returning();
    return result[0];
  }

  async deleteGroup(id: string): Promise<boolean> {
    try {
      // أولاً: إزالة ارتباط الطلاب بالمجموعة
      await db.update(students)
        .set({ groupId: null })
        .where(eq(students.groupId, id));
      
      // ثانياً: إزالة ارتباط المعلمين بالمجموعة
      await db.delete(teacherGroups).where(eq(teacherGroups.groupId, id));
      
      // ثالثاً: حذف المجموعة
      const result = await db.delete(groups).where(eq(groups.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error deleting group:', error);
      return false;
    }
  }

  async getSpecialStatuses(): Promise<SpecialStatus[]> {
    return await db.select().from(specialStatuses).orderBy(specialStatuses.name);
  }

  async getSpecialStatusById(id: string): Promise<SpecialStatus | undefined> {
    const result = await db.select().from(specialStatuses).where(eq(specialStatuses.id, id));
    return result[0];
  }

  async createSpecialStatus(status: InsertSpecialStatus): Promise<SpecialStatus> {
    const id = crypto.randomUUID();
    const result = await db.insert(specialStatuses).values({ ...status, id }).returning();
    return result[0];
  }

  async updateSpecialStatus(id: string, status: Partial<InsertSpecialStatus>): Promise<SpecialStatus | undefined> {
    const result = await db.update(specialStatuses).set(status).where(eq(specialStatuses.id, id)).returning();
    return result[0];
  }

  async deleteSpecialStatus(id: string): Promise<boolean> {
    const result = await db.delete(specialStatuses).where(eq(specialStatuses.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getStudents(): Promise<Student[]> {
    return await db.select().from(students).orderBy(students.name);
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id));
    return result[0];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = crypto.randomUUID();
    const now = new Date();
    const result = await db.insert(students).values({ ...student, id, createdAt: now, updatedAt: now }).returning();
    return result[0];
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const now = new Date();
    const result = await db.update(students).set({ ...student, updatedAt: now }).where(eq(students.id, id)).returning();
    return result[0];
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async createManyStudents(studentsData: InsertStudent[]): Promise<Student[]> {
    const now = new Date();
    const studentsWithIds = studentsData.map(s => ({
      ...s,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }));
    const result = await db.insert(students).values(studentsWithIds).returning();
    return result;
  }

  async getTeachers(): Promise<Teacher[]> {
    return await db.select().from(teachers).orderBy(teachers.name);
  }

  async getTeacherById(id: string): Promise<Teacher | undefined> {
    const result = await db.select().from(teachers).where(eq(teachers.id, id));
    return result[0];
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const id = crypto.randomUUID();
    const now = new Date();
    const result = await db.insert(teachers).values({ ...teacher, id, createdAt: now, updatedAt: now }).returning();
    return result[0];
  }

  async updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const now = new Date();
    const result = await db.update(teachers).set({ ...teacher, updatedAt: now }).where(eq(teachers.id, id)).returning();
    return result[0];
  }

  async deleteTeacher(id: string): Promise<boolean> {
    const result = await db.delete(teachers).where(eq(teachers.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getTeacherGroups(): Promise<TeacherGroup[]> {
    return await db.select().from(teacherGroups);
  }

  async getTeacherGroupsByTeacherId(teacherId: string): Promise<TeacherGroup[]> {
    return await db.select().from(teacherGroups).where(eq(teacherGroups.teacherId, teacherId));
  }

  async createTeacherGroup(teacherGroup: InsertTeacherGroup): Promise<TeacherGroup> {
    const id = crypto.randomUUID();
    const result = await db.insert(teacherGroups).values({ ...teacherGroup, id }).returning();
    return result[0];
  }

  async deleteTeacherGroup(id: string): Promise<boolean> {
    const result = await db.delete(teacherGroups).where(eq(teacherGroups.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getStudentVisits(): Promise<StudentVisit[]> {
    return await db.select().from(studentVisits).orderBy(desc(studentVisits.visitDate));
  }

  async getStudentVisitsByStudentId(studentId: string): Promise<StudentVisit[]> {
    return await db.select().from(studentVisits).where(eq(studentVisits.studentId, studentId)).orderBy(desc(studentVisits.visitDate));
  }

  async createStudentVisit(visit: InsertStudentVisit): Promise<StudentVisit> {
    const id = crypto.randomUUID();
    const result = await db.insert(studentVisits).values({ ...visit, id }).returning();
    
    // تحديث عداد الزيارات للطالب (atomic increment لتجنب race conditions)
    if (visit.studentId) {
      await db.update(students)
        .set({ visitCount: sql`COALESCE(${students.visitCount}, 0) + 1` })
        .where(eq(students.id, visit.studentId));
    }
    
    return result[0];
  }

  async deleteStudentVisit(id: string): Promise<boolean> {
    try {
      // جلب الزيارة أولاً لمعرفة الطالب
      const visits = await db.select().from(studentVisits).where(eq(studentVisits.id, id));
      const visit = visits[0];
      
      if (!visit) return false;
      
      // حذف الزيارة
      const result = await db.delete(studentVisits).where(eq(studentVisits.id, id));
      
      // تحديث عداد الزيارات للطالب (تقليل بواحد)
      if (visit.studentId && result.rowCount && result.rowCount > 0) {
        await db.update(students)
          .set({ visitCount: sql`GREATEST(COALESCE(${students.visitCount}, 0) - 1, 0)` })
          .where(eq(students.id, visit.studentId));
      }
      
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error deleting student visit:', error);
      return false;
    }
  }

  async getStudentPermissions(): Promise<StudentPermission[]> {
    return await db.select().from(studentPermissions).orderBy(desc(studentPermissions.permissionDate));
  }

  async getStudentPermissionsByStudentId(studentId: string): Promise<StudentPermission[]> {
    return await db.select().from(studentPermissions).where(eq(studentPermissions.studentId, studentId)).orderBy(desc(studentPermissions.permissionDate));
  }

  async createStudentPermission(permission: InsertStudentPermission): Promise<StudentPermission> {
    const id = crypto.randomUUID();
    const result = await db.insert(studentPermissions).values({ ...permission, id }).returning();
    return result[0];
  }

  async deleteStudentPermission(id: string): Promise<boolean> {
    const result = await db.delete(studentPermissions).where(eq(studentPermissions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getStudentViolations(): Promise<StudentViolation[]> {
    return await db.select().from(studentViolations).orderBy(desc(studentViolations.violationDate));
  }

  async getStudentViolationsByStudentId(studentId: string): Promise<StudentViolation[]> {
    return await db.select().from(studentViolations).where(eq(studentViolations.studentId, studentId)).orderBy(desc(studentViolations.violationDate));
  }

  async createStudentViolation(violation: InsertStudentViolation): Promise<StudentViolation> {
    const id = crypto.randomUUID();
    const result = await db.insert(studentViolations).values({ ...violation, id }).returning();
    return result[0];
  }

  async deleteStudentViolation(id: string): Promise<boolean> {
    const result = await db.delete(studentViolations).where(eq(studentViolations.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getTeacherProfile(): Promise<TeacherProfile | undefined> {
    const result = await db.select().from(teacherProfile);
    return result[0];
  }

  async createOrUpdateTeacherProfile(profile: InsertTeacherProfile): Promise<TeacherProfile> {
    const existing = await this.getTeacherProfile();
    if (existing) {
      const result = await db.update(teacherProfile).set(profile).where(eq(teacherProfile.id, existing.id)).returning();
      return result[0];
    } else {
      const id = crypto.randomUUID();
      const result = await db.insert(teacherProfile).values({ ...profile, id }).returning();
      return result[0];
    }
  }

  async getLoginCredentials(username: string): Promise<LoginCredentials | undefined> {
    const result = await db.select().from(loginCredentials).where(eq(loginCredentials.username, username));
    return result[0];
  }

  async createLoginCredentials(credentials: InsertLoginCredentials): Promise<LoginCredentials> {
    const id = crypto.randomUUID();
    const now = new Date();
    const result = await db.insert(loginCredentials).values({ ...credentials, id, createdAt: now, updatedAt: now }).returning();
    return result[0];
  }

  async updateLoginCredentials(id: string, credentials: Partial<InsertLoginCredentials>): Promise<LoginCredentials | undefined> {
    const now = new Date();
    const result = await db.update(loginCredentials).set({ ...credentials, updatedAt: now }).where(eq(loginCredentials.id, id)).returning();
    return result[0];
  }

  async clearDatabase(): Promise<void> {
    // حذف جميع البيانات من الجداول بالترتيب الصحيح
    await db.delete(studentViolations);
    await db.delete(studentPermissions);
    await db.delete(studentVisits);
    await db.delete(teacherGroups);
    await db.delete(students);
    await db.delete(teachers);
    await db.delete(specialStatuses);
    await db.delete(groups);
  }

  async createPasswordResetToken(username: string): Promise<{ token: string, expiresAt: string } | null> {
    const user = await this.getLoginCredentials(username);
    if (!user) return null;

    // إنشاء رمز عشوائي مكون من 6 أرقام
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    
    // انتهاء الرمز بعد ساعة واحدة
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await db.update(loginCredentials)
      .set({ resetToken: token, resetTokenExpires: expiresAt, updatedAt: new Date() })
      .where(eq(loginCredentials.id, user.id));

    return { token, expiresAt };
  }

  async verifyPasswordResetToken(username: string, token: string): Promise<boolean> {
    const user = await this.getLoginCredentials(username);
    if (!user || !user.resetToken || !user.resetTokenExpires) return false;

    // التحقق من صحة الرمز
    if (user.resetToken !== token) return false;

    // التحقق من عدم انتهاء صلاحية الرمز
    const expiresAt = new Date(user.resetTokenExpires);
    if (expiresAt < new Date()) return false;

    return true;
  }

  async resetPassword(username: string, token: string, newPassword: string): Promise<boolean> {
    const isValid = await this.verifyPasswordResetToken(username, token);
    if (!isValid) return false;

    const user = await this.getLoginCredentials(username);
    if (!user) return false;

    // تحديث كلمة المرور وحذف الرمز
    await db.update(loginCredentials)
      .set({ 
        passwordHash: newPassword, 
        resetToken: null, 
        resetTokenExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(loginCredentials.id, user.id));

    return true;
  }
}

export const storage = new DbStorage();
