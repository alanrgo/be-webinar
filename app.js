import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import cardRoutes from "./routes/cards.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const mongoPassword = process.env.MONGODB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://alanrgo_db_user:${mongoPassword}@cluster0.mfv74dz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("🟢 Conectado ao MongoDB"))
  .catch((err) => console.error("Erro de conexão MongoDB:", err));

app.use(express.json());
app.use(cors());

// Rotas
app.use("/users", usersRouter);
app.use("/cards", cardRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
