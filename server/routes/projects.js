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

// Public
router.get('/',     getProjects)
router.get('/:id',  getProject)

// Admin protected
router.post('/',        protect, createProject)
router.post('/seed',    protect, seedProjects)
router.put('/:id',      protect, updateProject)
router.delete('/:id',   protect, deleteProject)

export default router
