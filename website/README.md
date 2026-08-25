# CLYRA Web Frontend

Production Next.js frontend for the CLYRA AI-Based Brain CT Analysis System.

## Runtime flow

The browser uploads a single CT image or an ordered five-slice PNG sequence to
`POST /api/analyze`. The server route forwards the request to the protected
FastAPI model service without exposing the backend API key to the browser.

## Deployment

Set the project root to `website` when importing this repository into Vercel.
Environment values and secrets must be configured in the hosting dashboard and
must never be committed to Git.

