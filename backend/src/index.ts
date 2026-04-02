import "reflect-metadata";
import { AppDataSource } from "./ormconfig";
import app from "./app";
import * as dotenv from "dotenv";
import swaggerAuthRoutes from './routes/swagger.routes';
import { startPmChangeListener } from './services/pmChangeListener';
dotenv.config();

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, async () => {
      console.log(`Server listening on ${PORT}`);
      // start DB notification listener to auto-run PM worker on data changes
      try { await startPmChangeListener(); } catch (err) { console.error('pmChangeListener start failed', err); }
    });
  })
  .catch((err: any) => {
    console.error("Data Source init error:", err);
    process.exit(1);
  });


// app.use('/api/docs', swaggerAuthRoutes); 
