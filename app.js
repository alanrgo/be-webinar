import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import cardRoutes from "./routes/cards.js";
import dotenv from "dotenv";

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

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// Rotas
app.use("/users", usersRouter);
app.use("/cards", cardRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
