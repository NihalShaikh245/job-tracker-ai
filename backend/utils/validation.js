const Joi = require('joi');

const jobFiltersSchema = Joi.object({
  query: Joi.string().max(100).allow(''),
  job_type: Joi.string().valid('all', 'fulltime', 'parttime', 'contractor', 'intern').default('all'),
  work_mode: Joi.string().valid('all', 'remote', 'hybrid', 'onsite').default('all'),
  date_posted: Joi.string().valid('all', '24h', 'week', 'month').default('all'),
  match_score: Joi.string().valid('all', 'high', 'medium', 'low').default('all'),
  location: Joi.string().max(50).allow(''),
  skills: Joi.string().pattern(/^[a-zA-Z0-9,]+$/).allow(''),
  page: Joi.number().integer().min(1).max(100).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const resumeUploadSchema = Joi.object({
  text: Joi.string().max(10000).required(),
  fileName: Joi.string().max(255).allow(''),
  userId: Joi.string().max(100).default('default')
});

const applicationSchema = Joi.object({
  job: Joi.object({
    job_id: Joi.string().required(),
    job_title: Joi.string().required(),
    employer_name: Joi.string().required(),
    job_city: Joi.string().allow(''),
    job_country: Joi.string().allow(''),
    job_apply_link: Joi.string().uri().allow(''),
    match_score: Joi.number().min(0).max(100)
  }).required(),
  status: Joi.string().valid('applied', 'interview', 'offer', 'rejected').default('applied'),
  userId: Joi.string().default('default')
});

const chatSchema = Joi.object({
  message: Joi.string().min(1).max(500).required(),
  context: Joi.object().optional()
});

module.exports = {
  validateJobFilters: (data) => jobFiltersSchema.validate(data),
  validateResumeUpload: (data) => resumeUploadSchema.validate(data),
  validateApplication: (data) => applicationSchema.validate(data),
  validateChat: (data) => chatSchema.validate(data)
};