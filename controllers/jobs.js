const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  if (jobs.length === 0) {
    return res.json({ msg: "No jobs exist at this time!", data: jobs });
  }
  return res.status(StatusCodes.OK).json({ jobs });
};

const getJob = async (req, res) => {
  const { id: position } = req.params;
  const job = await Job.findOne({ position, createdBy: req.user.userId });
  if (!job) {
    return res.json({ msg: `${position} job does not exist!`, data: job });
  }
  return res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  return res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { id: position } = req.params;
  const job = await Job.findOneAndUpdate(
    { createdBy: req.user.userId, position },
    { status: req.body.status, position: req.body.position }
  );
  if (!job) {
    return res.json({ msg: `${position} position does not exist!`, data: job });
  }
  return res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: position } = req.params;
  const job = await Job.findOneAndDelete({
    createdBy: req.user.userId,
    position,
    createdBy: req.user.userId,
  });
  if (!job) {
    return res.json({ msg: `${position} position does not exist!`, data: job });
  }
  return res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
