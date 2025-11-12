import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import passwordRoutes from "./routes/passwordRoutes.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/passwords", passwordRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)))
  .catch(err => console.error(err));
