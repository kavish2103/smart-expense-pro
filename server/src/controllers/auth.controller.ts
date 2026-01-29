import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { env } from "../config/env";
import { createNotification } from "./notification.controller";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  res.status(201).json({
    message: "User registered successfully",
    data: { id: user.id, email: user.email, name: user.name },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect current password" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  res.json({ message: "Password updated successfully" });

  await createNotification(
    userId,
    "Security Alert",
    "Your password was changed successfully.",
    "SUCCESS"
  );
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, email } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user,
    });

    await createNotification(
      userId,
      "Profile Updated",
      "Your account profile information has been updated.",
      "INFO"
    );
  } catch (error) {
    res.status(400).json({ message: "Failed to update profile. Email might be taken." });
  }
};
