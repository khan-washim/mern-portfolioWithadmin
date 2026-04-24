import express from 'express'
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  seedProjects,
} from '../controllers/projectController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

/**
 * @description Public Routes
 * Jekeu apnar projects dekhte parbe
 */
router.get('/', getProjects)
router.get('/:id', getProject)

/**
 * @description Admin Protected Routes
 * Sudhu valid token thakle (Admin Login thakle) egulo kaj korbe
 */
router.route('/')
  .post(protect, createProject)

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject)

// Seed route - Sudhu dev mode ba emergency data insert er jonno
router.post('/seed', protect, seedProjects)

export default router