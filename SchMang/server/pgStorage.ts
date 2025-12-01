import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { eq, asc, sql } from 'drizzle-orm';
import * as schema from '../shared/schema.js';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
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

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

export class PgStorage implements IStorage {
  // Groups
  async getGroups(): Promise<Group[]> {
    return await db.select().from(schema.groups).orderBy(asc(schema.groups.stage), asc(schema.groups.displayOrder));
  }

  async getGroupById(id: string): Promise<Group | undefined> {
    const results = await db.select().from(schema.groups).where(eq(schema.groups.id, id));
    return results[0];
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const id = crypto.randomUUID();
    const results = await db.insert(schema.groups).values({ ...group, id }).returning();
    return results[0];
  }

  async updateGroup(id: string, group: Partial<InsertGroup>): Promise<Group | undefined> {
    const results = await db.update(schema.groups).set(group).where(eq(schema.groups.id, id)).returning();
    return results[0];
  }

  async deleteGroup(id: string): Promise<boolean> {
    // تحديث الطلاب المرتبطين
    await db.update(schema.students).set({ groupId: null }).where(eq(schema.students.groupId, id));
    // حذف ارتباطات المعلمين
    await db.delete(schema.teacherGroups).where(eq(schema.teacherGroups.groupId, id));
    // حذف المجموعة
    const results = await db.delete(schema.groups).where(eq(schema.groups.id, id)).returning();
    return results.length > 0;
  }

  // Special Statuses
  async getSpecialStatuses(): Promise<SpecialStatus[]> {
    return await db.select().from(schema.specialStatuses).orderBy(asc(schema.specialStatuses.name));
  }

  async getSpecialStatusById(id: string): Promise<SpecialStatus | undefined> {
    const results = await db.select().from(schema.specialStatuses).where(eq(schema.specialStatuses.id, id));
    return results[0];
  }

  async createSpecialStatus(status: InsertSpecialStatus): Promise<SpecialStatus> {
    const id = crypto.randomUUID();
    const results = await db.insert(schema.specialStatuses).values({ ...status, id }).returning();
    return results[0];
  }

  async updateSpecialStatus(id: string, status: Partial<InsertSpecialStatus>): Promise<SpecialStatus | undefined> {
    const results = await db.update(schema.specialStatuses).set(status).where(eq(schema.specialStatuses.id, id)).returning();
    return results[0];
  }

  async deleteSpecialStatus(id: string): Promise<boolean> {
    const results = await db.delete(schema.specialStatuses).where(eq(schema.specialStatuses.id, id)).returning();
    return results.length > 0;
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return await db.select().from(schema.students).orderBy(asc(schema.students.name));
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    const results = await db.select().from(schema.students).where(eq(schema.students.id, id));
    return results[0];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const id = crypto.randomUUID();
    const results = await db.insert(schema.students).values({ ...student, id }).returning();
    return results[0];
  }

  async updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const results = await db.update(schema.students).set({ ...student, updatedAt: new Date() }).where(eq(schema.students.id, id)).returning();
    return results[0];
  }

  async deleteStudent(id: string): Promise<boolean> {
    // حذف السجلات المرتبطة
    await db.delete(schema.studentVisits).where(eq(schema.studentVisits.studentId, id));
    await db.delete(schema.studentPermissions).where(eq(schema.studentPermissions.studentId, id));
    await db.delete(schema.studentViolations).where(eq(schema.studentViolations.studentId, id));
    // حذف الطالب
    const results = await db.delete(schema.students).where(eq(schema.students.id, id)).returning();
    return results.length > 0;
  }

  async createManyStudents(students: InsertStudent[]): Promise<Student[]> {
    const studentsWithIds = students.map(s => ({
      ...s,
      id: crypto.randomUUID()
    }));
    return await db.insert(schema.students).values(studentsWithIds).returning();
  }

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return await db.select().from(schema.teachers).orderBy(asc(schema.teachers.name));
  }

  async getTeacherById(id: string): Promise<Teacher | undefined> {
    const results = await db.select().from(schema.teachers).where(eq(schema.teachers.id, id));
    return results[0];
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const id = crypto.randomUUID();
    const results = await db.insert(schema.teachers).values({ ...teacher, id }).returning();
    return results[0];
  }

  async updateTeacher(id: string, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const results = await db.update(schema.teachers).set({ ...teacher, updatedAt: new Date() }).where(eq(schema.teachers.id, id)).returning();
    return results[0];
  }

  async deleteTeacher(id: string): Promise<boolean> {
    await db.delete(schema.teacherGroups).where(eq(schema.teacherGroups.teacherId, id));
    const results = await db.delete(schema.teachers).where(eq(schema.teachers.id, id)).returning();
    return results.length > 0;
  }

  // Teacher Groups
  async getTeacherGroups(): Promise<TeacherGroup[]> {
    return await db.select().from(schema.teacherGroups);
  }

  async getTeacherGroupsByTeacherId(teacherId: string): Promise<TeacherGroup[]> {
    return await db.select().from(schema.teacherGroups).where(eq(schema.teacherGroups.teacherId, teacherId));
  }

  async createTeacherGroup(teacherGroup: InsertTeacherGroup): Promise<TeacherGroup> {
    const id = crypto.randomUUID();
    const results = await db.insert(schema.teacherGroups).values({ ...teacherGroup, id }).returning();
    return results[0];
  }

  async deleteTeacherGroup(id: string): Promise<boolean> {
    const results = await db.delete(schema.teacherGroups).where(eq(schema.teacherGroups.id, id)).returning();
    return results.length > 0;
  }

  // Student Visits
  async getStudentVisits(): Promise<StudentVisit[]> {
    return await db.select().from(schema.studentVisits).orderBy(asc(schema.studentVisits.visitDate));
  }

  async getStudentVisitsByStudentId(studentId: string): Promise<StudentVisit[]> {
    return await db.select().from(schema.studentVisits).where(eq(schema.studentVisits.studentId, studentId));
  }

  async createStudentVisit(visit: InsertStudentVisit): Promise<StudentVisit> {
    return await db.transaction(async (tx) => {
      const id = crypto.randomUUID();
      const results = await tx.insert(schema.studentVisits).values({ ...visit, id }).returning();
      
      // تحديث عداد الزيارات للطالب بشكل ذري (مع معالجة NULL)
      if (visit.studentId) {
        await tx.update(schema.students)
          .set({ visitCount: sql`COALESCE(visit_count, 0) + 1` })
          .where(eq(schema.students.id, visit.studentId));
      }
      
      return results[0];
    });
  }

  async deleteStudentVisit(id: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
      // الحصول على معرف الطالب قبل الحذف
      const visitToDelete = await tx.select().from(schema.studentVisits).where(eq(schema.studentVisits.id, id));
      if (visitToDelete.length === 0) return false;
      
      const studentId = visitToDelete[0].studentId;
      const results = await tx.delete(schema.studentVisits).where(eq(schema.studentVisits.id, id)).returning();
      
      // تقليل عداد الزيارات (مع حماية من NULL والسالب)
      if (studentId) {
        await tx.update(schema.students)
          .set({ visitCount: sql`GREATEST(0, COALESCE(visit_count, 0) - 1)` })
          .where(eq(schema.students.id, studentId));
      }
      
      return results.length > 0;
    });
  }

  // Student Permissions
  async getStudentPermissions(): Promise<StudentPermission[]> {
    return await db.select().from(schema.studentPermissions).orderBy(asc(schema.studentPermissions.permissionDate));
  }

  async getStudentPermissionsByStudentId(studentId: string): Promise<StudentPermission[]> {
    return await db.select().from(schema.studentPermissions).where(eq(schema.studentPermissions.studentId, studentId));
  }

  async createStudentPermission(permission: InsertStudentPermission): Promise<StudentPermission> {
    return await db.transaction(async (tx) => {
      const id = crypto.randomUUID();
      const results = await tx.insert(schema.studentPermissions).values({ ...permission, id }).returning();
      
      // تحديث عداد الاستئذانات وحالة الطالب بشكل ذري
      if (permission.studentId) {
        await tx.update(schema.students)
          .set({ 
            permissionCount: sql`COALESCE(permission_count, 0) + 1`,
            status: "استئذان"
          })
          .where(eq(schema.students.id, permission.studentId));
      }
      
      return results[0];
    });
  }

  async deleteStudentPermission(id: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
      // الحصول على معرف الطالب قبل الحذف
      const permissionToDelete = await tx.select().from(schema.studentPermissions).where(eq(schema.studentPermissions.id, id));
      if (permissionToDelete.length === 0) return false;
      
      const studentId = permissionToDelete[0].studentId;
      const results = await tx.delete(schema.studentPermissions).where(eq(schema.studentPermissions.id, id)).returning();
      
      // تقليل عداد الاستئذانات (مع حماية من NULL والسالب)
      if (studentId) {
        await tx.update(schema.students)
          .set({ permissionCount: sql`GREATEST(0, COALESCE(permission_count, 0) - 1)` })
          .where(eq(schema.students.id, studentId));
      }
      
      return results.length > 0;
    });
  }

  // Student Violations
  async getStudentViolations(): Promise<StudentViolation[]> {
    return await db.select().from(schema.studentViolations).orderBy(asc(schema.studentViolations.violationDate));
  }

  async getStudentViolationsByStudentId(studentId: string): Promise<StudentViolation[]> {
    return await db.select().from(schema.studentViolations).where(eq(schema.studentViolations.studentId, studentId));
  }

  async createStudentViolation(violation: InsertStudentViolation): Promise<StudentViolation> {
    return await db.transaction(async (tx) => {
      const id = crypto.randomUUID();
      const results = await tx.insert(schema.studentViolations).values({ ...violation, id }).returning();
      
      // تحديث عداد المخالفات للطالب بشكل ذري (مع معالجة NULL)
      if (violation.studentId) {
        await tx.update(schema.students)
          .set({ violationCount: sql`COALESCE(violation_count, 0) + 1` })
          .where(eq(schema.students.id, violation.studentId));
      }
      
      return results[0];
    });
  }

  async deleteStudentViolation(id: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
      // الحصول على معرف الطالب قبل الحذف
      const violationToDelete = await tx.select().from(schema.studentViolations).where(eq(schema.studentViolations.id, id));
      if (violationToDelete.length === 0) return false;
      
      const studentId = violationToDelete[0].studentId;
      const results = await tx.delete(schema.studentViolations).where(eq(schema.studentViolations.id, id)).returning();
      
      // تقليل عداد المخالفات (مع حماية من NULL والسالب)
      if (studentId) {
        await tx.update(schema.students)
          .set({ violationCount: sql`GREATEST(0, COALESCE(violation_count, 0) - 1)` })
          .where(eq(schema.students.id, studentId));
      }
      
      return results.length > 0;
    });
  }

  // Teacher Profile
  async getTeacherProfile(): Promise<TeacherProfile | undefined> {
    const results = await db.select().from(schema.teacherProfile).limit(1);
    return results[0];
  }

  async createOrUpdateTeacherProfile(profile: InsertTeacherProfile): Promise<TeacherProfile> {
    const existing = await this.getTeacherProfile();
    if (existing) {
      const results = await db.update(schema.teacherProfile).set(profile).where(eq(schema.teacherProfile.id, existing.id)).returning();
      return results[0];
    } else {
      const id = crypto.randomUUID();
      const results = await db.insert(schema.teacherProfile).values({ ...profile, id }).returning();
      return results[0];
    }
  }

  // Login Credentials
  async getLoginCredentials(username: string): Promise<LoginCredentials | undefined> {
    const results = await db.select().from(schema.loginCredentials).where(eq(schema.loginCredentials.username, username));
    return results[0];
  }

  async createLoginCredentials(credentials: InsertLoginCredentials): Promise<LoginCredentials> {
    const id = crypto.randomUUID();
    const results = await db.insert(schema.loginCredentials).values({ ...credentials, id }).returning();
    return results[0];
  }

  async updateLoginCredentials(id: string, credentials: Partial<InsertLoginCredentials>): Promise<LoginCredentials | undefined> {
    const results = await db.update(schema.loginCredentials).set({ ...credentials, updatedAt: new Date() }).where(eq(schema.loginCredentials.id, id)).returning();
    return results[0];
  }

  // Password Reset
  async createPasswordResetToken(username: string): Promise<{ token: string, expiresAt: string } | null> {
    const user = await this.getLoginCredentials(username);
    if (!user) return null;

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await this.updateLoginCredentials(user.id, {
      resetToken: token,
      resetTokenExpires: expiresAt
    });

    return { token, expiresAt };
  }

  async verifyPasswordResetToken(username: string, token: string): Promise<boolean> {
    const user = await this.getLoginCredentials(username);
    if (!user || !user.resetToken || !user.resetTokenExpires) return false;

    const now = new Date();
    const expiryDate = new Date(user.resetTokenExpires);

    return user.resetToken === token && now < expiryDate;
  }

  async resetPassword(username: string, token: string, newPassword: string): Promise<boolean> {
    const isValid = await this.verifyPasswordResetToken(username, token);
    if (!isValid) return false;

    const user = await this.getLoginCredentials(username);
    if (!user) return false;

    await this.updateLoginCredentials(user.id, {
      passwordHash: newPassword,
      resetToken: null,
      resetTokenExpires: null
    });

    return true;
  }

  // Clear Database
  async clearDatabase(): Promise<void> {
    await db.delete(schema.studentViolations);
    await db.delete(schema.studentPermissions);
    await db.delete(schema.studentVisits);
    await db.delete(schema.teacherGroups);
    await db.delete(schema.students);
    await db.delete(schema.teachers);
    await db.delete(schema.groups);
    await db.delete(schema.specialStatuses);
  }

  // Import Data (preserves IDs)
  async importData(data: any): Promise<void> {
    if (data.groups?.length) {
      await db.insert(schema.groups).values(data.groups);
    }
    if (data.specialStatuses?.length) {
      await db.insert(schema.specialStatuses).values(data.specialStatuses);
    }
    if (data.teachers?.length) {
      await db.insert(schema.teachers).values(data.teachers);
    }
    if (data.students?.length) {
      await db.insert(schema.students).values(data.students);
    }
    if (data.teacherGroups?.length) {
      await db.insert(schema.teacherGroups).values(data.teacherGroups);
    }
    if (data.studentVisits?.length) {
      await db.insert(schema.studentVisits).values(data.studentVisits);
    }
    if (data.studentPermissions?.length) {
      await db.insert(schema.studentPermissions).values(data.studentPermissions);
    }
    if (data.studentViolations?.length) {
      await db.insert(schema.studentViolations).values(data.studentViolations);
    }
    if (data.teacherProfile) {
      await db.insert(schema.teacherProfile).values(data.teacherProfile);
    }
  }
}
