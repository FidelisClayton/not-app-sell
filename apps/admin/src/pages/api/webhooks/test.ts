import { NextApiRequest, NextApiResponse } from "next";
import initMiddleware from "@/lib/init-middleware";
import Cors from "cors";

const cors = initMiddleware(
  Cors({
    methods: ["POST", "OPTIONS"], // Allowed methods
    origin: "*", // Replace with your allowed origin
  }),
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await cors(req, res);

  console.log(
    JSON.stringify(
      {
        body: req.body,
        query: req.query,
        headers: req.headers,
      },
      null,
      2,
    ),
  );

  return res.status(200).end();
}
