import Contact from '../models/Contact.js'
import { asyncHandler } from '../middleware/error.js'
import nodemailer from 'nodemailer'

// Send optional email notification
const sendEmail = async ({ name, email, subject, message }) => {
  if (!process.env.EMAIL_USER) return // skip if not configured
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: `[DevFolio] New Message: ${subject}`,
      html: `
        <h3>New contact form submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
    })
  } catch (e) {
    console.warn('⚠️  Email sending failed:', e.message)
  }
}

// @desc   Submit contact form
// @route  POST /api/contact
// @access Public
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: 'All fields are required' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email address' })

  const contact = await Contact.create({
    name, email, subject, message,
    ip: req.ip,
  })

  await sendEmail({ name, email, subject, message })

  res.status(201).json({
    success: true,
    message: 'Message received! I will get back to you within 24 hours.',
    id: contact._id,
  })
})

// @desc   Get all messages (admin)
// @route  GET /api/contact
// @access Private
export const getMessages = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1
  const limit = parseInt(req.query.limit) || 20
  const skip  = (page - 1) * limit

  const [messages, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(),
  ])

  res.json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: messages,
  })
})

// @desc   Mark message as read
// @route  PATCH /api/contact/:id/read
// @access Private
export const markRead = asyncHandler(async (req, res) => {
  const msg = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: 'read' },
    { new: true }
  )
  if (!msg) return res.status(404).json({ message: 'Message not found' })
  res.json({ success: true, data: msg })
})

// @desc   Delete message
// @route  DELETE /api/contact/:id
// @access Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Contact.findByIdAndDelete(req.params.id)
  if (!msg) return res.status(404).json({ message: 'Message not found' })
  res.json({ success: true, message: 'Deleted successfully' })
})
