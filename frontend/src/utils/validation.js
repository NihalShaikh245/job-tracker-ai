const Joi = require('joi');

const jobFiltersSchema = Joi.object({
  query: Joi.string().max(100),
  job_type: Joi.string().valid('all', 'fulltime', 'parttime', 'contractor', 'intern'),
  work_mode: Joi.string().valid('all', 'remote', 'hybrid', 'onsite'),
  date_posted: Joi.string().valid('all', '24h', 'week', 'month'),
  match_score: Joi.string().valid('all', 'high', 'medium', 'low'),
  location: Joi.string().max(50),
  skills: Joi.string().pattern(/^[a-zA-Z,]+$/),
  page: Joi.number().integer().min(1).max(100),
  limit: Joi.number().integer().min(1).max(100)
});

const resumeUploadSchema = Joi.object({
  text: Joi.string().max(10000).required(),
  fileName: Joi.string().max(255),
  userId: Joi.string().max(100).required()
});

const applicationSchema = Joi.object({
  job: Joi.object({
    job_id: Joi.string().required(),
    job_title: Joi.string().required(),
    employer_name: Joi.string().required()
  }).required(),
  status: Joi.string().valid('applied', 'interview', 'offer', 'rejected'),
  userId: Joi.string().required()
});

module.exports = {
  validateJobFilters: (data) => jobFiltersSchema.validate(data),
  validateResumeUpload: (data) => resumeUploadSchema.validate(data),
  validateApplication: (data) => applicationSchema.validate(data)
};