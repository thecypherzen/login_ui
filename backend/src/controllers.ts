import { Request, Response } from "express";
import db from "./dbClient";

const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username) {
    res.json({ code: 2, message: "Missing username" });
    return;
  }
  if (!password) {
    res.json({ code: 2, message: "Missing password" });
    return;
  }
  try {
    const user = await db.client.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      res.status(404).json({ code: 1, message: "User not found" });
      return;
    }
    console.log("user:", user);
    res.json({ code: 0, ...user });
  } catch (err: Error | any) {
    console.log("error", err);
    res.status(500).json({
      code: 3,
      message: err?.message ?? "some error occured",
      details: JSON.stringify(err),
    });
  }
};

export { loginController };
