import User from "../models/user.js";
import { hashPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao buscar usuários", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "ID inválido", error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { name, about, avatar, password, email } = req.body;
  try {
    const newUser = await User.create({
      name,
      about,
      avatar,
      password: hashPassword(password),
      email,
    });
    const { password: savedPassword, ...userWithoutPassword } =
      newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erro ao criar usuário", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findUserByCredentials({ email, password });
    if (user.error) {
      return res.status(401).json({ message: user.error });
    }
    const { NODE_ENV, JWT_SECRET } = process.env;

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
    res.status(201).json({
      data: { id: user.id, token },
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erro ao criar usuário", error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { name, about } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    ).orFail(() => new Error("Usuário não encontrado"));

    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.message === "Usuário não encontrado") {
      return res.status(404).json({ message: err.message });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Dados inválidos", error: err.message });
    }
    res
      .status(500)
      .json({ message: "Erro ao atualizar perfil", error: err.message });
  }
};

export const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    ).orFail(() => new Error("Usuário não encontrado"));

    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.message === "Usuário não encontrado") {
      return res.status(404).json({ message: err.message });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Avatar inválido", error: err.message });
    }
    res
      .status(500)
      .json({ message: "Erro ao atualizar avatar", error: err.message });
  }
};
