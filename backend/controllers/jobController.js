  import { addJob, getAllJobs, getJobById, getJobByJobId, updateJob, updateJobByShortId, deleteJob } from "../models/jobModel.js";

// ✅ Create Job
const createJob = async (req, res) => {
  let { job_id, title, description, location, type, salary, requirements } =
    req.body;

  const jobData = {
    job_id,
    title,
    description,
    location,
    type,
    salary,
    requirements,
  };

  try {
    const newJob = await addJob(jobData);
    return res.status(201).json(newJob);
  } catch (error) {
    console.error("Error in createJob:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    return res.json(jobs);
  } catch (error) {
    console.error("Error in getJobs:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get Job by UUID
const getJob = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    console.error(`Invalid job id received: ${id}`);
    return res.status(400).json({ error: "Invalid job id" });
  }
  try {
    const job = await getJobById(id);
    if (job) {
      return res.json(job);
    } else {
      console.warn(`No job found for id: ${id}`);
      return res.status(404).json({ error: "Job not found" });
    }
  } catch (error) {
    console.error(`Error in getJob for id ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get Job by job_id (short id)
const getJobByShortId = async (req, res) => {
  const { job_id } = req.params;
  if (!job_id || job_id === "undefined") {
    console.error(`Invalid job_id received: ${job_id}`);
    return res.status(400).json({ error: "Invalid job_id" });
  }
  try {
    const job = await getJobByJobId(job_id);
    if (job) {
      return res.json(job);
    } else {
      console.warn(`No job found for job_id: ${job_id}`);
      return res.status(404).json({ error: "Job not found" });
    }
  } catch (error) {
    console.error(`Error in getJobByShortId for job_id ${job_id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Update Job
const editJob = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ error: "Invalid job id" });
  }

  try {
    const updatedJob = await updateJob(id, req.body);
    return res.json(updatedJob);
  } catch (error) {
    console.error(`Error in editJob for id ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};


// ✅ Update Job by short job_id
const editJobByShortId = async (req, res) => {
  const { job_id } = req.params;
  if (!job_id || job_id === "undefined") {
    return res.status(400).json({ error: "Invalid job_id" });
  }
  try {
    const updatedJob = await updateJobByShortId(job_id, req.body);
    return res.json(updatedJob);
  } catch (error) {
    console.error(`Error in editJobByShortId for job_id ${job_id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Job
const removeJob = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ error: "Invalid job id" });
  }

  try {
    const deletedJob = await deleteJob(id);
    return res.json({ message: "Job deleted successfully", deletedJob });
  } catch (error) {
    console.error(`Error in removeJob for id ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};

export { createJob, getJobs, getJob, getJobByShortId, editJob, editJobByShortId, removeJob };
