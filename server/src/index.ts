import express, { Request, Response } from "express";

const app = express();

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
