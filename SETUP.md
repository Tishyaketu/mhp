# Quick Setup Guide

## 🚀 Getting Started

### 1. Get an OMDb API Key
1. Visit [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Select the **FREE** option (1,000 daily requests)
3. Enter your email address
4. Check your email and activate your key
5. Copy your API key (it will look like: `12abc345`)

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit the `.env` file:**
```env
OMDB_API_KEY=12abc345  # Replace with your actual API key
OMDB_BASE_URL=https://www.omdbapi.com/
```

```bash
# Start the backend
npm run start:dev
```

✅ Backend should now be running on **http://localhost:3001**

### 3. Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

✅ Frontend should now be running on **http://localhost:3000**

### 4. Test the Application

1. Open your browser to **http://localhost:3000**
2. Search for a movie (e.g., "batman")
3. Add movies to favorites
4. Check the favorites page

## 🐛 Troubleshooting

### "Invalid URL" Error
**Problem:** `OMDb API error: TypeError: Invalid URL`

**Solution:** You haven't created the `.env` file or haven't added your API key.
1. Make sure `.env` file exists in `backend` folder
2. Make sure `OMDB_API_KEY` is set to your actual API key (not `your_api_key_here`)
3. Restart the backend server after creating/editing `.env`

### "Port already in use" Error
**Problem:** `Error: listen EADDRINUSE: address already in use`

**Solution:** Another process is using the port.
```bash
# Kill processes on port 3001 (backend)
npx kill-port 3001

# Kill processes on port 3000 (frontend)
npx kill-port 3000
```

### Movies not loading
**Problem:** Search returns no results

**Possible causes:**
1. Backend not running - check if http://localhost:3001 is accessible
2. Invalid API key - verify your key is correct and activated
3. API limit reached - free tier has 1,000 requests/day

## 📝 Project Structure

```
mhp3/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── movies/      # Movie search service
│   │   ├── favorites/   # Favorites management
│   │   └── database/    # SQLite database service
│   ├── .env.example     # Environment template
│   └── favorites.db     # SQLite database (auto-created)
│
└── frontend/            # Next.js frontend
    ├── app/             # App router pages
    ├── components/      # React components
    └── lib/             # API client
```

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] OMDb API key obtained and activated
- [ ] Backend `.env` file created with API key
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend running on port 3001
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running on port 3000
- [ ] Can search for movies
- [ ] Can add/remove favorites
- [ ] Favorites persist after backend restart
