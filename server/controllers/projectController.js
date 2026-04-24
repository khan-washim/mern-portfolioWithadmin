import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.category) filter.category = req.query.category;

  // Order onujayi sort kora (highest order prothome thakbe)
  const projects = await Project.find(filter).sort({ order: -1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ success: true, data: project });
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin Only)
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin Only)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ success: true, data: project });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin Only)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
});

// @desc    Seed sample projects (Update for new Schema)
// @route   POST /api/projects/seed
// @access  Private
export const seedProjects = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production')
    return res.status(403).json({ message: 'Not allowed in production' });

  await Project.deleteMany();

  const samples = [
    { 
        title: 'Business Dashboard', 
        description: 'Admin panel with analytics, auth & role management.', 
        technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js'], 
        image: 'https://picsum.photos/600/380?random=10', 
        category: 'Web',
        featured: true, 
        order: 1 
    },
    { 
        title: 'Hotel Booking App', 
        description: 'Full-featured booking platform with Stripe payment.', 
        technologies: ['MERN', 'Stripe', 'JWT', 'Bootstrap'], 
        image: 'https://picsum.photos/600/380?random=20', 
        category: 'Web',
        featured: true, 
        order: 2 
    },
    { 
        title: 'Unicorn POS System', 
        description: 'Pharmacy POS with dark mode, invoices & analytics.', 
        technologies: ['React', 'Express', 'MongoDB', 'PWA'], 
        image: 'https://picsum.photos/600/380?random=30', 
        category: 'Tool',
        featured: true, 
        order: 3 
    }
  ];

  const projects = await Project.insertMany(samples);
  res.status(201).json({ success: true, count: projects.length, data: projects });
});