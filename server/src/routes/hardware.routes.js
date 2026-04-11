const express = require('express');
const router = express.Router();
const { getHardware, createHardware, getHardwareById, updateHardware, deleteHardware } = require('../controllers/hardware.controller');
const auth = require('../middleware/auth');

router.route('/')
  .get(getHardware)
  .post(auth, createHardware);

router.route('/:id')
  .get(getHardwareById)
  .put(auth, updateHardware)
  .delete(auth, deleteHardware);

module.exports = router;
