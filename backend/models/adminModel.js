import prisma from "../db/index.js";

const getAdminByEmail = async (email) => {
  try {
    return await prisma.Admin.findUnique({
      where: { email },
    });
  } catch (error) {
    throw new Error("Error fetching admin");
  }
};


// Create new admin
const createAdmin = async ({ name, email, password }) => {
  try {
    return await prisma.Admin.create({
      data: { name, email, password },
    });
  } catch (error) {
    throw new Error("Error creating admin");
  }
};

// Fetch all admins
const getAllAdmins = async () => {
  try {
    return await prisma.Admin.findMany({ select: { id: true, name: true, email: true, created_at: true, updated_at: true } });
  } catch (error) {
    throw new Error("Error fetching admins");
  }
};


export { getAdminByEmail, createAdmin, getAllAdmins };
