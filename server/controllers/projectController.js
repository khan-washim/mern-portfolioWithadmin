import Project from '../models/Project.js'
import { asyncHandler } from '../middleware/error.js'

// @desc   Get all projects
// @route  GET /api/projects
// @access Public
export const getProjects = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.featured === 'true') filter.featured = true

  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 })
  res.json({ success: true, count: projects.length, data: projects })
})

// @desc   Get single project
// @route  GET /api/projects/:id
// @access Public
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) return res.status(404).json({ message: 'Project not found' })
  res.json({ success: true, data: project })
})

// @desc   Create project
// @route  POST /api/projects
// @access Private
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body)
  res.status(201).json({ success: true, data: project })
})

// @desc   Update project
// @route  PUT /api/projects/:id
// @access Private
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  })
  if (!project) return res.status(404).json({ message: 'Project not found' })
  res.json({ success: true, data: project })
})

// @desc   Delete project
// @route  DELETE /api/projects/:id
// @access Private
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) return res.status(404).json({ message: 'Project not found' })
  res.json({ success: true, message: 'Project deleted' })
})

// @desc   Seed sample projects (dev only)
// @route  POST /api/projects/seed
// @access Private
export const seedProjects = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production')
    return res.status(403).json({ message: 'Not allowed in production' })

  await Project.deleteMany()

  const samples = [
    { title:'Business Dashboard', description:'Admin panel with analytics, auth & role management.', tags:['React','Node.js','MongoDB','Chart.js'], image:'https://picsum.photos/600/380?random=10', accent:'#c6ff00', featured:true, order:1 },
    { title:'Hotel Booking App',  description:'Full-featured booking platform with Stripe payment.', tags:['MERN','Stripe','JWT','Bootstrap'], image:'https://picsum.photos/600/380?random=20', accent:'#ff3c5f', featured:true, order:2 },
    { title:'POS System',         description:'Pharmacy POS with dark mode, invoices & analytics.', tags:['React','Express','MongoDB','PWA'], image:'https://picsum.photos/600/380?random=30', accent:'#4dffb4', featured:true, order:3 },
    { title:'E-Commerce Platform',description:'Multi-vendor marketplace with cart & admin panel.', tags:['MERN','Redux','Cloudinary'], image:'https://picsum.photos/600/380?random=40', accent:'#c084fc', order:4 },
    { title:'Task Manager',       description:'Real-time collaboration with drag-and-drop.', tags:['React','Socket.io','Node.js'], image:'https://picsum.photos/600/380?random=50', accent:'#60a5fa', order:5 },
    { title:'Blog CMS',           description:'Content management with rich editor & SEO tools.', tags:['React','Node.js','Quill'], image:'https://picsum.photos/600/380?random=60', accent:'#fb923c', order:6 },
  ]

  const projects = await Project.insertMany(samples)
  res.status(201).json({ success: true, count: projects.length, data: projects })
})
