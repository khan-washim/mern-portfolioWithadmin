import express from 'express'
import {
  submitContact,
  getMessages,
  markRead,
  deleteMessage,
} from '../controllers/contactController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Public
router.post('/', submitContact)

// Admin protected
router.get('/',              protect, getMessages)
router.patch('/:id/read',   protect, markRead)
router.delete('/:id',       protect, deleteMessage)

export default router
