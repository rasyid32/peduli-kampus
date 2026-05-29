const express = require('express');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllCategories);
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['teknisi_admin']),
  createCategory
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['teknisi_admin']),
  updateCategory
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['teknisi_admin']),
  deleteCategory
);

module.exports = router;

//farhan ganteng