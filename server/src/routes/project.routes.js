const express = require('express');
const router = express.Router();
const { getProjects, createProject, getProjectById, updateProject } = require('../controllers/project.controller');
const auth = require('../middleware/auth');

router.route('/')
  .get(getProjects)
  .post(auth, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(auth, updateProject);

module.exports = router;
