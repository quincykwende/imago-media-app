
# IMAGO Media Search - Frontend
Next.js frontend for searching and browsing media content from Elasticsearch.

## Prerequisites
- Node.js 18+ (I used v22)
- Backend service running (FastAPI server)

## Getting Started
1. **Clone repository**
```bash
https://github.com/quincykwende/imago-media-app.git
cd imago-media-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. **Build and run production server**
```bash
npm run build
npm start
```

5. **Access application**
```
http://localhost:3000
```
