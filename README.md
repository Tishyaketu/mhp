# MHP Takeaway Home


A full-stack movie application with favorites functionality, built with Next.js frontend and NestJS backend.

## Development Workflow

### Setup

#### Prerequisites
1. **Node.js** 18+ installed
2. **OMDb API Key**: Get a free API key from [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your OMDb API key
# OMDB_API_KEY=your_actual_api_key_here
# OMDB_BASE_URL=https://www.omdbapi.com/

# Start the backend server
npm run start
# Backend will run on http://localhost:3001
```

#### Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm run dev
# Frontend will run on http://localhost:3000
```

#### Important Notes
- ⚠️ **You must create a `.env` file** in the `backend` directory with your OMDb API key
- The `.env` file is gitignored for security (it contains your API key)
- Without the API key, movie search will not work

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database
- SQLite database file: `backend/favorites.db`
- Automatic schema creation on startup
- Seed data included for development



## Architecture Overview

### Frontend (Next.js 15 + TypeScript)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: TanStack Query (React Query) for server state management
- **Testing**: Jest + React Testing Library for component testing
- **Type Safety**: Full TypeScript implementation

### Backend (NestJS + TypeScript)
- **Framework**: NestJS for scalable Node.js server-side applications
- **Database**: SQLite for persistent data storage
- **API Design**: RESTful API endpoints
- **Testing**: Jest for unit testing with mocked dependencies
- **Architecture**: Modular design with separate modules for movies and favorites

## Key Technical Decisions

### 1. Database Choice: SQLite
**Decision**: Use SQLite for favorites persistence instead of in-memory storage.

**Rationale**:
- **Persistence**: Data survives server restarts
- **Simplicity**: No external database server required
- **Development**: Easy setup and local development
- **Performance**: Sufficient for the application scale
- **Portability**: Single file database, easy to backup/move

**Implementation**:
- Custom `DatabaseService` with Promise-based SQLite operations
- Automatic table creation and seed data on startup
- Proper error handling for database constraints

### 2. Frontend State Management: TanStack Query
**Decision**: Use TanStack Query instead of Redux or Context API.

**Rationale**:
- **Server State**: Optimized for server state management
- **Caching**: Built-in caching and background refetching
- **Loading States**: Automatic loading/error state management
- **Optimistic Updates**: Easy implementation of optimistic UI updates
- **Developer Experience**: Excellent DevTools and debugging

### 3. API Architecture: RESTful Design
**Decision**: Implement RESTful API endpoints instead of GraphQL.

**Rationale**:
- **Simplicity**: Straightforward CRUD operations
- **Caching**: Better HTTP caching support
- **Tooling**: Excellent tooling and debugging support
- **Team Familiarity**: More widely understood

**Endpoints**:
```
GET    /favorites           # Get all favorites
POST   /favorites           # Add to favorites
DELETE /favorites/:imdbID   # Remove from favorites
GET    /movies/search?q=... # Search movies (OMDB API)
```

### 4. Testing Strategy: Unit + Integration
**Decision**: Focus on unit tests with mocked dependencies.

**Rationale**:
- **Fast Feedback**: Quick test execution
- **Isolation**: Test components in isolation
- **Reliability**: Consistent test results
- **Coverage**: Focus on business logic testing

**Implementation**:
- Frontend: Jest + React Testing Library
- Backend: Jest with mocked DatabaseService
- Component testing for UI interactions
- Service testing for business logic

### 5. Project Structure: Monorepo
**Decision**: Keep frontend and backend in the same repository.

**Rationale**:
- **Development Speed**: Easier to make changes across both layers
- **Shared Types**: Potential for shared TypeScript interfaces
- **Deployment**: Simplified deployment pipeline
- **Version Control**: Single source of truth for the entire application

### 6. Error Handling Strategy
**Decision**: Comprehensive error handling at multiple layers.

**Rationale**:
- **User Experience**: Graceful degradation with meaningful error messages
- **Debugging**: Proper error logging and stack traces
- **Resilience**: Application continues to function despite errors

**Implementation**:
- Database constraint errors (duplicate favorites)
- Network request failures with retry logic
- Loading and error states in UI components
- Validation errors for API requests