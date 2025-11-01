import {
  addEmployee,
  getAllEmployees,
  getEmployeeByCertificateId,
  getEmployeeById,
  editEmployeeByCertificateNo,
  deleteEmployeeByCertificateNo,
} from "../models/employeeModel.js";
import QRCode from "qrcode";

// Add Employee
const createEmployee = async (req, res) => {
  let {
    idNo,
    certificateNo,
    fullName,
    email,
    phoneNumber,
    joiningDate,
    designation,
    department,
    image,
    certificateURL,
    achievementsURL,
  } = req.body;

  const employeeData = {
    idNo,
    certificateNo,
    fullName,
    email,
    phoneNumber,
    joiningDate: new Date(joiningDate),
    designation,
    department,
    image,
    certificateURL,
    achievementsURL,
  };

  try {
    const newEmployee = await addEmployee(employeeData);
    return res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error in createEmployee:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get All Employees
const getEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    return res.json(employees);
  } catch (error) {
    console.error("Error in getEmployees:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Employee by Certificate ID
const getEmployee = async (req, res) => {
  const { certificateNo } = req.params; // Changed from certificateId to certificateNo
  if (!certificateNo || certificateNo === "undefined") {
    console.error(`Invalid certificateNo received: ${certificateNo}`);
    return res.status(400).json({ error: "Invalid certificateNo" });
  }
  try {
    const employee = await getEmployeeByCertificateId(certificateNo);
    if (employee) {
      return res.json(employee);
    } else {
      console.warn(`No employee found for certificateNo: ${certificateNo}`);
      return res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error(
      `Error in getEmployee for certificateNo ${certificateNo}:`,
      error
    );
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

// Edit Employee by CertificateNo
const editEmployee = async (req, res) => {
  const { certificateNo } = req.params;
  // Only allow specific fields to be updated
  const allowedFields = [
    'fullName', 'email', 'phoneNumber', 'joiningDate', 'designation', 'department', 'image', 'certificateURL', 'achievementsURL'
  ];
  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }
  if (!certificateNo || certificateNo === "undefined") {
    return res.status(400).json({ error: "Invalid certificateNo" });
  }
  try {
    const updatedEmployee = await editEmployeeByCertificateNo(certificateNo, updateData);
    return res.json(updatedEmployee);
  } catch (error) {
    console.error(`Error in editEmployee for certificateNo ${certificateNo}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete Employee by CertificateNo
const deleteEmployee = async (req, res) => {
  const { certificateNo } = req.params;
  if (!certificateNo || certificateNo === "undefined") {
    return res.status(400).json({ error: "Invalid certificateNo" });
  }
  try {
    const deletedEmployee = await deleteEmployeeByCertificateNo(certificateNo);
    return res.json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.error(`Error in deleteEmployee for certificateNo ${certificateNo}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

export { createEmployee, getEmployees, getEmployee, editEmployee, deleteEmployee };