import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email already used" });
  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, name, email, token: sign(user._id) });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password",
  );
  if (!user || !(await user.matchPassword(req.body.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: sign(user._id),
  });
};
