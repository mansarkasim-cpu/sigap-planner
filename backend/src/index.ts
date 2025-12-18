import "reflect-metadata";
import { AppDataSource } from "./ormconfig";
import app from "./app";
import * as dotenv from "dotenv";
import swaggerAuthRoutes from './routes/swagger.routes';
dotenv.config();

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Data Source init error:", err);
    process.exit(1);
  });


// app.use('/api/docs', swaggerAuthRoutes); 
