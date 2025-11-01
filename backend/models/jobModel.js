import prisma from "../db/index.js";

// Add new job
const addJob = async (jobData) => {
  try {
    const newJob = await prisma.job.create({
      data: {
        job_id: jobData.job_id,
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        requirements: jobData.requirements,
      },
    });
    return newJob;
  } catch (error) {
    console.error("Error adding job:", error);
    throw new Error("Error adding job");
  }
};

// Get all jobs
const getAllJobs = async () => {
  try {
    const jobs = await prisma.job.findMany();
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Error fetching jobs");
  }
};

// Get job by primary id (UUID)
const getJobById = async (id) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
    });
    return job;
  } catch (error) {
    console.error(`Error fetching job by id ${id}:`, error);
    throw new Error("Error fetching job");
  }
};

// Get job by job_id (custom short ID)
const getJobByJobId = async (job_id) => {
  try {
    const job = await prisma.job.findUnique({
      where: { job_id },
    });
    return job;
  } catch (error) {
    console.error(`Error fetching job by job_id ${job_id}:`, error);
    throw new Error("Error fetching job");
  }
};

// Update job by UUID
const updateJob = async (id, jobData) => {
  try {
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        requirements: jobData.requirements,
      },
    });
    return updatedJob;
  } catch (error) {
    console.error(`Error updating job ${id}:`, error);
    throw new Error("Error updating job");
  }
};

// Update job by short job_id
const updateJobByShortId = async (job_id, jobData) => {
  try {
    const updatedJob = await prisma.job.update({
      where: { job_id },
      data: {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        requirements: jobData.requirements,
      },
    });
    return updatedJob;
  } catch (error) {
    console.error(`Error updating job by job_id ${job_id}:`, error);
    throw new Error("Error updating job by job_id");
  }
};

// Delete job
const deleteJob = async (id) => {
  try {
    const deletedJob = await prisma.job.delete({
      where: { id },
    });
    return deletedJob;
  } catch (error) {
    console.error(`Error deleting job ${id}:`, error);
    throw new Error("Error deleting job");
  }
};

export { addJob, getAllJobs, getJobById, getJobByJobId, updateJob, updateJobByShortId, deleteJob };
