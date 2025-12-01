import { pgTable, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  stage: varchar("stage").notNull(),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
});
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

export const specialStatuses = pgTable("special_statuses", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSpecialStatusSchema = createInsertSchema(specialStatuses).omit({
  id: true,
  createdAt: true,
});
export type InsertSpecialStatus = z.infer<typeof insertSpecialStatusSchema>;
export type SpecialStatus = typeof specialStatuses.$inferSelect;

export const students = pgTable("students", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  nationalId: varchar("national_id").notNull(),
  phone: varchar("phone").notNull(),
  guardianPhone: varchar("guardian_phone").notNull(),
  grade: varchar("grade").notNull(),
  groupId: varchar("group_id").references(() => groups.id),
  status: varchar("status").notNull().default("نشط"),
  specialStatusId: varchar("special_status_id").references(() => specialStatuses.id),
  visitCount: integer("visit_count").default(0),
  permissionCount: integer("permission_count").default(0),
  violationCount: integer("violation_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  specialization: varchar("specialization").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

export const teacherGroups = pgTable("teacher_groups", {
  id: varchar("id").primaryKey(),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  groupId: varchar("group_id").references(() => groups.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTeacherGroupSchema = createInsertSchema(teacherGroups).omit({
  id: true,
  createdAt: true,
});
export type InsertTeacherGroup = z.infer<typeof insertTeacherGroupSchema>;
export type TeacherGroup = typeof teacherGroups.$inferSelect;

export const studentVisits = pgTable("student_visits", {
  id: varchar("id").primaryKey(),
  studentId: varchar("student_id").references(() => students.id),
  visitDate: varchar("visit_date").notNull(),
  reason: text("reason").notNull(),
  actionTaken: text("action_taken").notNull(),
  referredTo: varchar("referred_to").notNull().default("لا يوجد"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudentVisitSchema = createInsertSchema(studentVisits).omit({
  id: true,
  createdAt: true,
});
export type InsertStudentVisit = z.infer<typeof insertStudentVisitSchema>;
export type StudentVisit = typeof studentVisits.$inferSelect;

export const studentPermissions = pgTable("student_permissions", {
  id: varchar("id").primaryKey(),
  studentId: varchar("student_id").references(() => students.id),
  permissionDate: varchar("permission_date").notNull(),
  exitTime: varchar("exit_time"),
  reason: text("reason").notNull(),
  guardianNotified: boolean("guardian_notified").default(false),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudentPermissionSchema = createInsertSchema(studentPermissions).omit({
  id: true,
  createdAt: true,
});
export type InsertStudentPermission = z.infer<typeof insertStudentPermissionSchema>;
export type StudentPermission = typeof studentPermissions.$inferSelect;

export const studentViolations = pgTable("student_violations", {
  id: varchar("id").primaryKey(),
  studentId: varchar("student_id").references(() => students.id),
  violationDate: varchar("violation_date").notNull(),
  violationType: varchar("violation_type").notNull(),
  description: text("description").default(""),
  actionTaken: text("action_taken").default(""),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudentViolationSchema = createInsertSchema(studentViolations).omit({
  id: true,
  createdAt: true,
});
export type InsertStudentViolation = z.infer<typeof insertStudentViolationSchema>;
export type StudentViolation = typeof studentViolations.$inferSelect;

export const teacherProfile = pgTable("teacher_profile", {
  id: varchar("id").primaryKey(),
  name: varchar("name").default(""),
  schoolName: varchar("school_name").default(""),
  systemTitle: varchar("system_title").default(""),
  logoUrl: varchar("logo_url").default(""),
  autoLogoutMinutes: integer("auto_logout_minutes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTeacherProfileSchema = createInsertSchema(teacherProfile).omit({
  id: true,
  createdAt: true,
});
export type InsertTeacherProfile = z.infer<typeof insertTeacherProfileSchema>;
export type TeacherProfile = typeof teacherProfile.$inferSelect;

export const loginCredentials = pgTable("login_credentials", {
  id: varchar("id").primaryKey(),
  username: varchar("username").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  resetToken: varchar("reset_token"),
  resetTokenExpires: varchar("reset_token_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLoginCredentialsSchema = createInsertSchema(loginCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLoginCredentials = z.infer<typeof insertLoginCredentialsSchema>;
export type LoginCredentials = typeof loginCredentials.$inferSelect;
