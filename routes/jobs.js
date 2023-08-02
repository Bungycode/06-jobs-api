const express = require("express");
const router = express();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

// domain/api/v1/jobs
router.route("/").get(getAllJobs).post(createJob);
// domain/api/v1/jobs/:id
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
