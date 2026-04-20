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
