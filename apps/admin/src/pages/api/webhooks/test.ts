import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
