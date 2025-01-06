import { match } from "ts-pattern";

export enum WebhookEventName {
  "OrderApproved" = "OrderApproved",
  "OrderRefunded" = "OrderRefunded",
  "Chargeback" = "Chargeback",
  "SubscriptionCanceled" = "SubscriptionCanceled",
  "SubscriptionRenewed" = "SubscriptionRenewed",
}

export enum KiwifyWebhookEventName {
  OrderApproved = "order_approved",
  OrderRefunded = "order_refunded",
  Chargeback = "chargeback",
  SubscriptionCanceled = "subscription_canceled",
  SubscriptionRenewed = "subscription_renewed",
}

export const fromKiwify = (event: KiwifyWebhookEventName): WebhookEventName => {
  return match(event)
    .with(
      KiwifyWebhookEventName.OrderApproved,
      () => WebhookEventName.OrderApproved,
    )
    .with(
      KiwifyWebhookEventName.OrderRefunded,
      () => WebhookEventName.OrderRefunded,
    )
    .with(KiwifyWebhookEventName.Chargeback, () => WebhookEventName.Chargeback)
    .with(
      KiwifyWebhookEventName.SubscriptionCanceled,
      () => WebhookEventName.SubscriptionCanceled,
    )
    .with(
      KiwifyWebhookEventName.SubscriptionRenewed,
      () => WebhookEventName.SubscriptionRenewed,
    )
    .otherwise(() => {
      throw new Error(`Event not supported: ${event}`);
    });
};
