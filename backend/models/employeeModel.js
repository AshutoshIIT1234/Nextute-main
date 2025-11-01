import prisma from "../db/index.js";

const addEmployee = async (employeeData) => {
  try {
    const newEmployee = await prisma.employee.create({
      data: {
        idNo: employeeData.idNo,
        certificateNo: employeeData.certificateNo,
        fullName: employeeData.fullName,
        email: employeeData.email,
        phoneNumber: employeeData.phoneNumber,
        joiningDate: employeeData.joiningDate,
        designation: employeeData.designation,
        department: employeeData.department,
        image: employeeData.image,
        certificateURL: employeeData.certificateURL,
        achievementsURL: employeeData.achievementsURL,
      },
    });
    return newEmployee;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw new Error("Error adding employee");
  }
};

const getAllEmployees = async () => {
  try {
    const employees = await prisma.employee.findMany();
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Error fetching employees");
  }
};

const getEmployeeById = async (id) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id }, // Changed from employeeId to id
    });
    return employee;
  } catch (error) {
    console.error(`Error fetching employee by id ${id}:`, error);
    throw new Error("Error fetching employee");
  }
};

const getEmployeeByCertificateId = async (certificateNo) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { certificateNo }, // Changed from certificateId to certificateNo
    });
    return employee;
  } catch (error) {
    console.error(
      `Error fetching employee by certificateNo ${certificateNo}:`,
      error
    );
    throw new Error("Error fetching employee");
  }
};

// Edit employee by certificateNo
const editEmployeeByCertificateNo = async (certificateNo, updateData) => {
  try {
    console.log('EditEmployeeByCertificateNo called with:', { certificateNo, updateData });
    // Convert joiningDate to ISO-8601 if present and is a string
    if (updateData.joiningDate && typeof updateData.joiningDate === 'string') {
      updateData.joiningDate = new Date(updateData.joiningDate).toISOString();
    }
    const updatedEmployee = await prisma.employee.update({
      where: { certificateNo },
      data: updateData,
    });
    console.log('Updated employee result:', updatedEmployee);
    return updatedEmployee;
  } catch (error) {
    console.error(`Error editing employee by certificateNo ${certificateNo}:`, error);
    throw new Error("Error editing employee");
  }
};

// Delete employee by certificateNo
const deleteEmployeeByCertificateNo = async (certificateNo) => {
  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { certificateNo },
    });
    return deletedEmployee;
  } catch (error) {
    console.error(`Error deleting employee by certificateNo ${certificateNo}:`, error);
    throw new Error("Error deleting employee");
  }
};

export {
  addEmployee,
  getAllEmployees,
  getEmployeeByCertificateId,
  getEmployeeById,
  editEmployeeByCertificateNo,
  deleteEmployeeByCertificateNo,
};