# Overview

This is a Syrian mosque donation platform built with React and Express, featuring Arabic language support and RTL (right-to-left) design. The application allows users to browse Syrian mosques, view their details, explore donation projects, and interact with an integrated map interface. The platform serves as a charitable donation hub connecting donors with Syrian mosques in need of funding for various projects.

## Recent Updates (January 2025)
- Added donation verification system with trust badges and tooltips
- Implemented custom mosque icons on interactive map with preview cards
- Added auto-zoom functionality when filtering by city
- Integrated session storage to preserve user preferences (view mode, filters)
- Enhanced donation projects with optional image galleries
- Improved user experience with persistent state management

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern component-based architecture using functional components and hooks
- **Routing**: Client-side routing implemented with Wouter library for lightweight navigation
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom Arabic font (Tajawal) and RTL support
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express.js**: RESTful API server with TypeScript support
- **Storage Layer**: Abstract storage interface with in-memory implementation for development
- **API Design**: Resource-based endpoints for mosques and donations with search/filter capabilities
- **Development**: Hot reload and middleware logging for development experience

## Database Design
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Tables**: 
  - `mosques`: Core mosque information including location, capacity, and contact details
  - `donations`: Donation projects linked to specific mosques with funding targets
- **Relationships**: One-to-many relationship between mosques and donation projects

## UI/UX Architecture
- **Design System**: Consistent theming with mosque-specific color palette (green and gold)
- **Internationalization**: Arabic-first design with RTL layout and Arabic typography
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Interactive Features**: Map integration using Leaflet for geospatial visualization
- **Accessibility**: Semantic HTML and proper ARIA attributes through Radix UI components

## Development Workflow
- **Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas
- **Code Organization**: Monorepo structure with shared types and utilities
- **Development Server**: Integrated Vite development server with Express API proxy
- **Build Process**: Separate build processes for client and server with ESM module support

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18 with React DOM for component rendering
- **Express.js**: Web framework for RESTful API development
- **TypeScript**: Type system for both client and server code

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database provider (@neondatabase/serverless)

## UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Map Integration
- **Leaflet**: Open-source map library for interactive geographic displays
- **OpenStreetMap**: Tile provider for map visualization

## Development Tools
- **Vite**: Build tool and development server
- **TSX**: TypeScript execution environment for Node.js
- **PostCSS**: CSS processing with Autoprefixer

## Form and Data Management
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation library integrated with Drizzle
- **React Query**: Server state management and caching
- **date-fns**: Date manipulation utilities

## Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **nanoid**: URL-safe unique ID generator

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment