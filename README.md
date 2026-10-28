# Electronics Shopping

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB running locally or a MongoDB connection URI

## Setup

Install each package's dependencies:

```sh
npm install
npm install --prefix client
npm install --prefix server
```

Create `server/.env` from `server/.env.example` and set `MONGO_URI` and a private `JWT_SECRET`.

## Run

From the repository root, run both development servers:

```sh
npm run dev
```

The Vite frontend is available at `http://localhost:5173`; the API is at `http://localhost:5001`.
You can also run one side with `npm run dev:client` or `npm run dev:server`.
