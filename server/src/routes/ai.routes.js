const express = require('express');
const router = express.Router();
const { parseProject, matchResources } = require('../controllers/ai.controller');
const auth = require('../middleware/auth');

router.post('/parse-project', auth, parseProject);
router.post('/match-resources', auth, matchResources);

module.exports = router;
