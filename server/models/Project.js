import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image:       { type: String, default: '' },
    tags:        [{ type: String, trim: true }],
    liveUrl:     { type: String, default: '#' },
    githubUrl:   { type: String, default: '#' },
    accent:      { type: String, default: '#c6ff00' },
    featured:    { type: Boolean, default: false },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
