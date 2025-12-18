// src/swagger.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const router = express.Router();
const specPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const swaggerDocument = YAML.load(specPath);

// Optional: customise UI options
const options = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true
  }
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
export default router;
