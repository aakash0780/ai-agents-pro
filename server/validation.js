import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
  name: z.string().max(100, 'Name too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: z.string().max(100, 'Name too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
});

// Forgot password: email only
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

// Reset password: token + new password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().max(20, 'Phone number is too long').optional(),
  company: z.string().max(100, 'Company name is too long').optional(),
  service: z.string().max(100, 'Service is too long').optional(),
  source: z.string().max(100, 'Source is too long').optional(),
  pagePath: z.string().max(200, 'Page path is too long').optional(),
  message: z.string().min(1, 'Message is required').max(5000, 'Message is too long'),
});

export const leadSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(120, 'Full name is too long'),
  email: z.string().email('Invalid email address').min(1, 'Work email is required'),
  phone: z.string().max(30, 'Phone number is too long').optional(),
  companyName: z.string().min(1, 'Company name is required').max(120, 'Company name is too long'),
  companyWebsite: z.string().max(255, 'Company website is too long').optional(),
  industry: z.string().max(120, 'Industry is too long').optional(),
  companySize: z.string().max(50, 'Company size is too long').optional(),
  primaryGoal: z.string().min(1, 'Primary goal is required').max(200, 'Primary goal is too long'),
  currentTools: z.array(z.string().max(100, 'Tool name is too long')).max(30, 'Too many tools selected').optional().default([]),
  conversationVolume: z.string().max(80, 'Conversation volume value is too long').optional(),
  biggestChallenge: z.string().min(1, 'Biggest automation challenge is required').max(5000, 'Challenge is too long'),
  preferredContactMethod: z.string().max(80, 'Preferred contact method is too long').optional(),
  message: z.string().max(5000, 'Message is too long').optional(),
});

// Blog post create/update
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().max(200).optional(), // optional; server can derive from title
});

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = Array.isArray(error.issues) ? error.issues : [];
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: issues.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Validation error',
        },
      });
    }
  };
};
