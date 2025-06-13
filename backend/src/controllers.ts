import { Request, Response } from "express";
import db from "./dbClient";

const loginController = async (req: Request, res: Response) => {
  const data = req.body;
  res.json({ data });
};

export { loginController };
