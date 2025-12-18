// src/routes/swagger.routes.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const router = express.Router();

// PATH file YAML Anda
const specPath = path.join(__dirname, '..', '..', 'docs', 'openapi.yaml');

// Load YAML
const swaggerDocument = YAML.load(specPath);

// Opsional: konfigurasi UI
const options = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
  },
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

export default router;
