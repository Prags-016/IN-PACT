# IN-PACT Backend

Express + MongoDB (Mongoose) API for the IN-PACT civic intelligence platform.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, CLIENT_ORIGIN
npm run dev            # nodemon, http://localhost:5000
```

## Project structure

```
server.js                     entry point
src/
  app.js                      express app, middleware, route mounting
  config/
    db.js                     mongoose connection
    constants.js              status/severity/role enums — single source of
                               truth, must stay in sync with the frontend's
                               StatusBadge.jsx STATUS_CONFIG
  models/
    User.js
    Issue.js
  middleware/
    auth.js                   protect / authorize / optionalAuth
    errorHandler.js
    asyncHandler.js
  controllers/
    authController.js
    issueController.js
  routes/
    authRoutes.js
    issueRoutes.js
  utils/
    generateToken.js
```

## API

### Auth
| Method | Route              | Access  | Notes                          |
|--------|---------------------|---------|---------------------------------|
| POST   | /api/auth/register   | Public  | role always forced to "citizen" — admin accounts should be seeded/invited, not self-registered |
| POST   | /api/auth/login       | Public  |                                  |
| GET    | /api/auth/me          | Private | requires `Authorization: Bearer <token>` |

### Issues
| Method | Route                     | Access          | Notes |
|--------|----------------------------|-----------------|-------|
| GET    | /api/issues                 | Public (optional auth) | filters: `?status=&severity=&category=&department=&page=&limit=` |
| GET    | /api/issues/:id              | Public (optional auth) |       |
| POST   | /api/issues                  | Private (citizen)      |       |
| PATCH  | /api/issues/:id/status        | Private (admin)        | body: `{ status, note }` |
| POST   | /api/issues/:id/upvote        | Private                | toggles on/off |
| GET    | /api/issues/stats             | Private (admin)        | powers dashboard StatCards |

## Next steps / TODOs

- **Seed script**: add a `scripts/seed.js` to create the first admin user directly in the DB (never through the public register endpoint).
- **Image uploads**: `imageUrl` currently expects a URL string. Wire up Cloudinary/S3 + multer when the frontend adds a real upload flow (IssueCard.jsx already renders `imageUrl`).
- **Rate limiting**: add `express-rate-limit` on `/api/auth/login` before deploying, to slow down brute-force attempts.
- **Sync with frontend**: `src/config/constants.js` ISSUE_STATUSES must match `Frontend/src/StatusBadge.jsx` STATUS_CONFIG keys — the frontend currently has a second, inconsistent status list in `IssueCard.jsx` that needs to be reconciled to this one.
