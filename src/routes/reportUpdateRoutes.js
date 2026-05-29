const express = require('express');
const {
  getReportUpdates,
  createReportUpdate,
} = require('../controllers/reportUpdateController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, getReportUpdates);
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['teknisi_admin']),
  createReportUpdate
);

module.exports = router;
