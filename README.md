# MHP3 Movie App

A full-stack movie application with favorites functionality, built with Next.js frontend and NestJS backend.

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

## Development Workflow

### Setup
```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

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

## Future Considerations

### Scalability
- **Database**: Consider PostgreSQL for production scale
- **Caching**: Add Redis for API response caching
- **CDN**: Implement CDN for movie poster images

### Features
- **User Authentication**: Add user accounts and personal favorites
- **Search History**: Persist user search history
- **Recommendations**: Implement movie recommendation engine
- **Offline Support**: Add PWA capabilities for offline access

### Performance
- **Image Optimization**: Implement lazy loading for movie posters
- **API Rate Limiting**: Add rate limiting for external API calls
- **Database Indexing**: Add proper indexes for query optimization
