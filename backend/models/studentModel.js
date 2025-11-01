import prisma from "../db/index.js";
import { nanoid } from "nanoid";

const createStudent = async (student) => {
  const student_id = `NXS_${nanoid(6)}`;
  return await prisma.student.create({
    data: {
      student_id,
      name: student.name,
      email: student.email,
      password: student.password,
      gender: student.gender,
      phone_number: student.phoneNumber,
      date_of_birth: student.dateOfBirth,
      code: student.code,
      code_expires_at: student.code_expires_at,
      is_verified: false,
    },
  });
};

const findStudentByEmail = async (email) => {
  return await prisma.student.findUnique({
    where: { email },
  });
};

const findStudentByPhone = async (phone) => {
  return await prisma.student.findFirst({
    where: { phone_number: phone },
  });
};

const verifyStudent = async (email) => {
  return await prisma.student.update({
    where: { email },
    data: { is_verified: true, code: null, code_expires_at: null },
  });
};

const updateStudentResendVerificationCode = async (email, code, expiresAt) => {
  return await prisma.student.update({
    where: { email },
    data: { code, code_expires_at: expiresAt },
  });
};

const isStudentIdUnique = async (student_id) => {
  const student = await prisma.student.findUnique({
    where: { student_id },
  });
  return !student;
};

const findStudentById = async (id) => {
  return await prisma.student.findUnique({
    where: { id },
  });
};

// const findStudentById = async (id) => {
//   return await prisma.student.findUnique({
//     where: { id },
//   });
// };

// const isStudentIdUnique = async (student_id) => {
//   const existingStudent = await findStudentById(student_id);
//   return !existingStudent;
// };

const getAllStudents = async () => {
  return await prisma.student.findMany();
};

const deleteStudentByEmail = async (email) => {
  return await prisma.student.delete({
    where: { email },
  });
};

// Edit student by id (UUID)
const editStudentById = async (id, updateData) => {
  const allowedFields = [
    "id", "name", "email", "password", "gender", "phone_number", "address", "course", "date_of_birth",
    "is_verified", "code", "created_at", "updated_at", "code_expires_at", "student_id",
    "password_reset_token", "password_reset_expires", "profileImage", "bio", "languagePreference",
    "hobbies", "learningStyle", "targetExams", "attemptYear", "studyMode", "currentClass",
    "careerGoal", "preparationReason", "studyHours", "preferredTime", "favoriteSubjects",
    "socialLinks", "studyResources", "mentorshipPreference", "studyGoals", "extracurriculars",
    "enrolledCourses", "achievements", "notifications"
  ];

  // Filter out unknown fields
  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
  );
  // Convert date_of_birth to ISO-8601 if present and is a string
  if (filteredUpdateData.date_of_birth && typeof filteredUpdateData.date_of_birth === 'string') {
    filteredUpdateData.date_of_birth = new Date(filteredUpdateData.date_of_birth).toISOString();
  }
  return await prisma.student.update({
    where: { id },
    data: filteredUpdateData,
  });
};

export {
  createStudent,
  findStudentByEmail,
  findStudentByPhone,
  verifyStudent,
  updateStudentResendVerificationCode,
  isStudentIdUnique,
  findStudentById,
  deleteStudentByEmail,
  getAllStudents,
  editStudentById,
};
