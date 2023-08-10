const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  if (jobs.length === 0) {
    return res.json({ msg: "No jobs exist at this time!", data: jobs });
  }
  return res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id of ${jobId}!`);
  }
  return res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  return res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new NotFoundError("company or position fields cannot be empty!");
  }

  // We use req.body for the data to update instead of just "company" and "position" because the user may want to update more than just company and position. The user just has to atleast provide both company and position data for this request to work but are not limited to only updating these 2 data properties.
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) {
    throw new NotFoundError(`No job with id of ${jobId}!`);
  }
  return res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id of ${jobId}!`);
  }
  return res.status(StatusCodes.OK).json(`Deleted job with id of ${jobId}`);
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
