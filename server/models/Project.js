import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Please add a project title'], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Please add a description'], 
      trim: true 
    },
    image: { 
      type: String, 
      default: '' // Ekhane image URL store hobe
    },
    // Admin panel-er "technologies" field-er sathe match korate "tags" ke "technologies" kora hoyeche
    technologies: [{ 
      type: String, 
      trim: true 
    }],
    category: {
      type: String,
      enum: ['Web', 'Mobile', 'API', 'Tool', 'Other'],
      default: 'Web'
    },
    liveUrl: { 
      type: String, 
      default: '' 
    },
    githubUrl: { 
      type: String, 
      default: '' 
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
    order: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true }
);

// Schema-te technologies index kora thakle search korte subidha hoy
projectSchema.index({ title: 'text', technologies: 'text' });

export default mongoose.model('Project', projectSchema);