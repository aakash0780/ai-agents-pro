# AI Agent Instructions for ai-agents-website

## Project Overview
This is a React-based website built with Vite, utilizing ShadcnUI components and Prisma for database interactions. The project follows a modular architecture with clear separation of concerns.

## Key Architecture Patterns

### Component Structure
- UI components are located in `src/components/ui/`
- Reusable shadcn/ui components with consistent styling
- Pages are in `src/pages/` following a standard React component structure
- Common hooks in `src/hooks/` for shared functionality

### Path Aliases
Important path aliases defined in `components.json`:
```json
{
  "components": "@/components",
  "utils": "@/lib/utils",
  "ui": "@/components/ui",
  "lib": "@/lib",
  "hooks": "@/hooks"
}
```
Use these aliases for imports to maintain consistent code organization.

### Database Integration
- Prisma is configured in `prisma.config.ts`
- Database URL is managed through environment variables
- Schema is defined in `prisma/schema.prisma`

## Development Workflow

### Setup
1. Use PNPM as package manager (v10.4.1+)
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev` (Vite development server)

### Component Development
- Follow shadcn/ui patterns for new UI components
- Use Lucide icons (configured as iconLibrary)
- Maintain consistent styling using Tailwind CSS with the "new-york" style preset

### Conventions
- React components use `.jsx` extension
- State management uses React hooks pattern
- Components follow shadcn/ui naming and organization structure
- Form handling example in `ContactPage.jsx` shows standard form state management

## Common Patterns

### Component Implementation
```jsx
// Standard component structure
import { cn } from "@/lib/utils"
import { ComponentName } from "@/components/ui/component"

export function NewComponent({ className, ...props }) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* Component content */}
    </div>
  )
}
```

### Form Handling
```jsx
const [formData, setFormData] = useState({
  // Form fields
})

const handleInputChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
}
```

## Deployment

### Build Process
1. Generate production build: `pnpm build`
2. Preview build locally: `pnpm preview`
3. Build output is generated in `dist/` directory

### Deployment Checklist
- Set up environment variables:
  - `DATABASE_URL`: Prisma database connection string
  - Any other environment-specific configurations
- Run Prisma migrations: `npx prisma migrate deploy`
- Ensure all static assets are properly referenced

### Deployment Options
- Static hosting platforms (Vercel, Netlify, etc.)
- Docker containerization available (see `.dockerignore` for exclusions)
- Node.js hosting services (Heroku, DigitalOcean, etc.)

## Key Files
- `vite.config.js`: Build and development configuration
- `components.json`: UI component and project structure configuration
- `prisma.config.ts`: Database configuration
- `src/lib/utils.js`: Common utility functions