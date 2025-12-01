import type { Express } from "express";
import { PgStorage } from "./pgStorage.js";
import {
  insertStudentSchema, insertGroupSchema, insertSpecialStatusSchema,
  insertTeacherSchema, insertTeacherGroupSchema,
  insertStudentVisitSchema, insertStudentPermissionSchema,
  insertStudentViolationSchema, insertTeacherProfileSchema,
  insertLoginCredentialsSchema
} from "../shared/schema.js";

const storage = new PgStorage();

export function registerRoutes(app: Express) {
  // Groups routes
  app.get("/api/groups", async (_req, res) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  });

  app.post("/api/groups", async (req, res) => {
    try {
      const parsed = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(parsed);
      res.json(group);
    } catch (error) {
      res.status(400).json({ error: "Invalid group data" });
    }
  });

  app.patch("/api/groups/:id", async (req, res) => {
    try {
      const group = await storage.updateGroup(req.params.id, req.body);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ error: "Failed to update group" });
    }
  });

  app.delete("/api/groups/:id", async (req, res) => {
    try {
      const success = await storage.deleteGroup(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Group not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete group" });
    }
  });

  // Special Statuses routes
  app.get("/api/special-statuses", async (_req, res) => {
    try {
      const statuses = await storage.getSpecialStatuses();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch special statuses" });
    }
  });

  app.post("/api/special-statuses", async (req, res) => {
    try {
      const parsed = insertSpecialStatusSchema.parse(req.body);
      const status = await storage.createSpecialStatus(parsed);
      res.json(status);
    } catch (error) {
      res.status(400).json({ error: "Invalid status data" });
    }
  });

  app.delete("/api/special-statuses/:id", async (req, res) => {
    try {
      const success = await storage.deleteSpecialStatus(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Special status not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete special status" });
    }
  });

  // Students routes
  app.get("/api/students", async (_req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const parsed = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(parsed);
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: "Invalid student data" });
    }
  });

  app.post("/api/students/bulk", async (req, res) => {
    try {
      const students = req.body.students;
      if (!Array.isArray(students)) {
        return res.status(400).json({ error: "Expected array of students" });
      }
      const parsed = students.map(s => insertStudentSchema.parse(s));
      const result = await storage.createManyStudents(parsed);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid students data" });
    }
  });

  app.patch("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.updateStudent(req.params.id, req.body);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  // Teachers routes
  app.get("/api/teachers", async (_req, res) => {
    try {
      const teachers = await storage.getTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teachers" });
    }
  });

  app.post("/api/teachers", async (req, res) => {
    try {
      const parsed = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(parsed);
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ error: "Invalid teacher data" });
    }
  });

  app.patch("/api/teachers/:id", async (req, res) => {
    try {
      const teacher = await storage.updateTeacher(req.params.id, req.body);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: "Failed to update teacher" });
    }
  });

  app.delete("/api/teachers/:id", async (req, res) => {
    try {
      const success = await storage.deleteTeacher(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teacher" });
    }
  });

  // Teacher Groups routes
  app.get("/api/teacher-groups", async (_req, res) => {
    try {
      const teacherGroups = await storage.getTeacherGroups();
      res.json(teacherGroups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher groups" });
    }
  });

  app.get("/api/teacher-groups/teacher/:teacherId", async (req, res) => {
    try {
      const teacherGroups = await storage.getTeacherGroupsByTeacherId(req.params.teacherId);
      res.json(teacherGroups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher groups" });
    }
  });

  app.post("/api/teacher-groups", async (req, res) => {
    try {
      const parsed = insertTeacherGroupSchema.parse(req.body);
      const teacherGroup = await storage.createTeacherGroup(parsed);
      res.json(teacherGroup);
    } catch (error) {
      res.status(400).json({ error: "Invalid teacher group data" });
    }
  });

  app.delete("/api/teacher-groups/:id", async (req, res) => {
    try {
      const success = await storage.deleteTeacherGroup(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Teacher group not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete teacher group" });
    }
  });

  // Student Visits routes
  app.get("/api/student-visits", async (_req, res) => {
    try {
      const visits = await storage.getStudentVisits();
      res.json(visits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student visits" });
    }
  });

  app.get("/api/student-visits/student/:studentId", async (req, res) => {
    try {
      const visits = await storage.getStudentVisitsByStudentId(req.params.studentId);
      res.json(visits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student visits" });
    }
  });

  app.post("/api/student-visits", async (req, res) => {
    try {
      const parsed = insertStudentVisitSchema.parse(req.body);
      const visit = await storage.createStudentVisit(parsed);
      res.json(visit);
    } catch (error) {
      res.status(400).json({ error: "Invalid visit data" });
    }
  });

  app.delete("/api/student-visits/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudentVisit(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Student visit not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student visit" });
    }
  });

  // Student Permissions routes
  app.get("/api/student-permissions", async (_req, res) => {
    try {
      const permissions = await storage.getStudentPermissions();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student permissions" });
    }
  });

  app.get("/api/student-permissions/student/:studentId", async (req, res) => {
    try {
      const permissions = await storage.getStudentPermissionsByStudentId(req.params.studentId);
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student permissions" });
    }
  });

  app.post("/api/student-permissions", async (req, res) => {
    try {
      const parsed = insertStudentPermissionSchema.parse(req.body);
      const permission = await storage.createStudentPermission(parsed);
      res.json(permission);
    } catch (error) {
      res.status(400).json({ error: "Invalid permission data" });
    }
  });

  app.delete("/api/student-permissions/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudentPermission(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Student permission not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student permission" });
    }
  });

  // Student Violations routes
  app.get("/api/student-violations", async (_req, res) => {
    try {
      const violations = await storage.getStudentViolations();
      res.json(violations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student violations" });
    }
  });

  app.get("/api/student-violations/student/:studentId", async (req, res) => {
    try {
      const violations = await storage.getStudentViolationsByStudentId(req.params.studentId);
      res.json(violations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student violations" });
    }
  });

  app.post("/api/student-violations", async (req, res) => {
    try {
      const parsed = insertStudentViolationSchema.parse(req.body);
      const violation = await storage.createStudentViolation(parsed);
      res.json(violation);
    } catch (error) {
      res.status(400).json({ error: "Invalid violation data" });
    }
  });

  app.delete("/api/student-violations/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudentViolation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Student violation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete student violation" });
    }
  });

  // Teacher Profile routes
  app.get("/api/teacher-profile", async (_req, res) => {
    try {
      const profile = await storage.getTeacherProfile();
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teacher profile" });
    }
  });

  app.post("/api/teacher-profile", async (req, res) => {
    try {
      const parsed = insertTeacherProfileSchema.parse(req.body);
      const profile = await storage.createOrUpdateTeacherProfile(parsed);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid profile data" });
    }
  });

  // Login routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const credentials = await storage.getLoginCredentials(username);
      if (credentials && credentials.passwordHash === password) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/init-login", async (_req, res) => {
    try {
      const existing = await storage.getLoginCredentials("admin");
      if (!existing) {
        await storage.createLoginCredentials({
          username: "admin",
          passwordHash: "admin123"
        });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize login" });
    }
  });

  app.post("/api/update-login-credentials", async (req, res) => {
    try {
      const { currentUsername, newUsername, newPassword } = req.body;
      
      // التحقق من وجود المستخدم الحالي
      const existing = await storage.getLoginCredentials(currentUsername);
      if (!existing) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      // تحديث بيانات تسجيل الدخول
      await storage.updateLoginCredentials(existing.id, {
        username: newUsername,
        passwordHash: newPassword
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update credentials" });
    }
  });

  app.post("/api/clear-database", async (_req, res) => {
    try {
      await storage.clearDatabase();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear database" });
    }
  });

  app.post("/api/clear-database-selective", async (req, res) => {
    try {
      const options = req.body;
      
      if (options.all) {
        // حذف كل شيء
        await storage.clearDatabase();
      } else {
        // حذف محدد
        const { PgStorage } = await import("./pgStorage.js");
        const pgStorage = storage as InstanceType<typeof PgStorage>;
        
        if (options.violations) {
          await import('../shared/schema.js').then(async (schema) => {
            const { drizzle } = await import('drizzle-orm/neon-serverless');
            const { Pool } = await import('@neondatabase/serverless');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const db = drizzle(pool, { schema });
            await db.delete(schema.studentViolations);
          });
        }
        if (options.permissions) {
          await import('../shared/schema.js').then(async (schema) => {
            const { drizzle } = await import('drizzle-orm/neon-serverless');
            const { Pool } = await import('@neondatabase/serverless');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const db = drizzle(pool, { schema });
            await db.delete(schema.studentPermissions);
          });
        }
        if (options.visits) {
          await import('../shared/schema.js').then(async (schema) => {
            const { drizzle } = await import('drizzle-orm/neon-serverless');
            const { Pool } = await import('@neondatabase/serverless');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const db = drizzle(pool, { schema });
            await db.delete(schema.studentVisits);
          });
        }
        if (options.students) {
          await import('../shared/schema.js').then(async (schema) => {
            const { drizzle } = await import('drizzle-orm/neon-serverless');
            const { Pool } = await import('@neondatabase/serverless');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const db = drizzle(pool, { schema });
            await db.delete(schema.studentViolations);
            await db.delete(schema.studentPermissions);
            await db.delete(schema.studentVisits);
            await db.delete(schema.students);
          });
        }
        if (options.teachers) {
          await import('../shared/schema.js').then(async (schema) => {
            const { drizzle } = await import('drizzle-orm/neon-serverless');
            const { Pool } = await import('@neondatabase/serverless');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const db = drizzle(pool, { schema });
            await db.delete(schema.teacherGroups);
            await db.delete(schema.teachers);
          });
        }
        if (options.specialStatuses) {
          await import('../shared/schema.js').then(async (schema) => {
            const { drizzle } = await import('drizzle-orm/neon-serverless');
            const { Pool } = await import('@neondatabase/serverless');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const db = drizzle(pool, { schema });
            await db.delete(schema.specialStatuses);
          });
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing database selectively:", error);
      res.status(500).json({ error: "Failed to clear database" });
    }
  });

  app.post("/api/import-data", async (req, res) => {
    try {
      const { data } = req.body;
      
      // التحقق الشامل من صحة البيانات قبل الحذف
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: "Invalid data format: missing data object" });
      }
      
      // التحقق من وجود الجداول الضرورية
      const requiredTables = ['students', 'groups', 'teachers', 'special_statuses'];
      for (const table of requiredTables) {
        if (!Array.isArray(data[table])) {
          return res.status(400).json({ 
            error: `Invalid data format: ${table} must be an array` 
          });
        }
      }
      
      // التحقق من الجداول الاختيارية
      const optionalTables = ['teacher_groups', 'visits', 'permissions', 'violations'];
      for (const table of optionalTables) {
        if (data[table] !== undefined && !Array.isArray(data[table])) {
          return res.status(400).json({ 
            error: `Invalid data format: ${table} must be an array if provided` 
          });
        }
      }
      
      // التحقق من profile
      if (data.profile !== undefined && typeof data.profile !== 'object') {
        return res.status(400).json({ 
          error: "Invalid data format: profile must be an object if provided" 
        });
      }
      
      // حذف البيانات الحالية بعد التحقق من صحة الملف
      await storage.clearDatabase();
      
      // استيراد البيانات مع الحفاظ على الـ IDs الأصلية
      await storage.importData(data);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Import error:', error);
      res.status(500).json({ error: "Failed to import data. Database may be in inconsistent state." });
    }
  });

  // Password Reset
  app.post("/api/request-password-reset", async (req, res) => {
    try {
      const { username } = req.body;
      const result = await storage.createPasswordResetToken(username);
      
      if (!result) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      res.json({ success: true, token: result.token });
    } catch (error) {
      res.status(500).json({ error: "Failed to create reset token" });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    try {
      const { username, token, newPassword } = req.body;
      const success = await storage.resetPassword(username, token, newPassword);
      
      if (!success) {
        res.status(400).json({ error: "Invalid or expired token" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  });
}
