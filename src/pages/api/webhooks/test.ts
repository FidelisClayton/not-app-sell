import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(
    JSON.stringify(
      {
        req,
      },
      null,
      2,
    ),
  );

  return res.status(200).end();
}
