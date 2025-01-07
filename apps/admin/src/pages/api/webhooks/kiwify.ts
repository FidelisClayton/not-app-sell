import { NextApiRequest, NextApiResponse } from "next";
import { CustomerRepository } from "@/repositories/customer-repository";
import { CustomerAppRepository } from "@/repositories/customer-app-repository";
import { CustomerProductRepository } from "@/repositories/customer-product-repository";
import { ProductRepository } from "@/repositories/product-repository";
import { match, P } from "ts-pattern";
import {
  fromKiwify,
  KiwifyWebhookEventName,
  WebhookEventName,
} from "@/types/webhook-event-type";
import { z } from "zod";
import initMiddleware from "@/lib/init-middleware";
import Cors from "cors";

const kiwifyBodySchema = z.object({
  webhook_event_type: z.string(),
  Product: z.object({
    product_id: z.string(),
  }),
  Customer: z.object({
    full_name: z.string(),
    email: z.string().email(),
  }),
});

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      webhook_event_type,
      Customer: { email, full_name: fullName },
      Product: { product_id: productId },
    } = kiwifyBodySchema.parse(req.body);
    const eventType = fromKiwify(webhook_event_type as KiwifyWebhookEventName);

    // Ensure customer exists
    let customer = await CustomerRepository.findByEmail(email);
    if (!customer) {
      customer = await CustomerRepository.create({
        name: fullName, // Use email prefix as a default name
        email,
      });
    }

    if (!customer) {
      console.log("Customer is not created");
      return res.status(400).json({ error: "User not created" });
    }

    // Fetch the products and its associated app
    const products =
      await ProductRepository.getAllByExternalProductId(productId);
    if (!products.length) {
      return res
        .status(404)
        .json({ error: `Product with id "${productId}" not found` });
    }

    for (const product of products) {
      const appId = product.app;

      await new Promise((resolve) => {
        match(eventType)
          .with(WebhookEventName.OrderApproved, async () => {
            // Grant access to the app
            await CustomerAppRepository.upsert(customer._id, appId, {
              isActive: true,
            });

            // Grant access to the product
            await CustomerProductRepository.upsert(customer._id, product._id, {
              isActive: true,
            });

            resolve(null);
          })
          .with(
            P.union(
              WebhookEventName.OrderRefunded,
              WebhookEventName.Chargeback,
              WebhookEventName.SubscriptionCanceled,
            ),
            async () => {
              await CustomerProductRepository.deactivate(
                customer._id.toString(),
                product._id.toString(),
              );

              resolve(null);
            },
          )
          .with(WebhookEventName.SubscriptionRenewed, async () => {
            await CustomerProductRepository.activate(
              customer._id.toString(),
              product._id.toString(),
            );
            resolve(null);
          })
          .otherwise(() => {
            resolve(null);
            return res
              .status(400)
              .json({ error: `Unsupported event type: ${eventType}` });
          });
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
