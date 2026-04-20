# 📁 Project Structure

This document outlines the organized structure of the AI Agents Pro project.

## 🗂️ Directory Organization

### Root Level
```
ai-web/
├── 📄 Configuration Files
│   ├── package.json          # Dependencies and scripts
│   ├── vite.config.js        # Vite build configuration
│   ├── components.json       # shadcn/ui configuration
│   ├── eslint.config.js      # ESLint configuration
│   ├── jsconfig.json         # JavaScript path aliases
│   └── index.html           # HTML entry point
│
├── 📚 docs/                  # All documentation
│   ├── audits/               # Technical audit reports
│   ├── setup/                # Setup and troubleshooting guides
│   └── README.md             # Documentation index
│
├── 🔧 scripts/                # Utility scripts
│   ├── *.sh                  # Shell scripts
│   ├── *.js                  # JavaScript utilities
│   └── README.md             # Scripts documentation
│
├── 💻 src/                    # Source code
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── [custom components]
│   ├── pages/                # Page components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   └── lib/                  # Utilities
│
├── 🗄️ server/                 # Backend server
│   └── index.js              # Express server
│
├── 🗃️ prisma/                  # Database
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
│
└── 🖼️ public/                 # Static assets
    └── [images, favicon, etc.]
```

---

## 📚 Documentation Structure

### `/docs/audits/`
Technical audit and review reports:
- `COMPREHENSIVE_PROJECT_REVIEW.md` - Full project analysis
- `TECHNICAL_UI_AUDIT.md` - React + Tailwind technical audit
- `UI_AUDIT_REPORT.md` - UI/UX audit report
- `UNUSED_FILES_REPORT.md` - Unused files cleanup report

### `/docs/setup/`
Setup, configuration, and troubleshooting guides:
- `SETUP.md` - Main setup instructions
- `QUICK_START.md` - Quick start guide
- `AUTHENTICATION_FEATURES.md` - Authentication documentation
- `FIX_PERMISSIONS.md` - Permission fixing guide
- `TROUBLESHOOTING_SIGNUP.md` - Signup troubleshooting

### `/docs/`
General documentation:
- `AGENTS.md` - AI agent instructions
- `AI_AUTOMATION_BUSINESS_BLUEPRINT.md` - Business blueprint
- `README.md` - Documentation index

---

## 🔧 Scripts Structure

### `/scripts/`
Utility scripts and helpers:
- `setup-env.sh` - Environment setup
- `verify-setup.sh` - Verify project setup
- `run.sh` - Run project
- `fix-db-permissions.sh` - Fix database permissions
- `fix-permissions-quick.sh` - Quick permission fix
- `check-env.js` - Check environment variables
- `verify-env.js` - Verify environment configuration

---

## 💡 Benefits of This Organization

1. **Clean Root Directory** - Only essential config files in root
2. **Easy Navigation** - Logical grouping of related files
3. **Better Maintainability** - Easy to find and update documentation
4. **Scalability** - Easy to add new docs/scripts without cluttering
5. **Professional Structure** - Industry-standard organization

---

## 📝 Notes

- All markdown documentation is in `/docs/`
- All utility scripts are in `/scripts/`
- Configuration files remain in root (standard practice)
- Source code structure unchanged (already well-organized)

---

**Last Updated:** January 2025

