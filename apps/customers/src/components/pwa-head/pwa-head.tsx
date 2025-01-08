import { colorsTheme } from "@shared/lib/theme";
import { AppDocument } from "@shared/models/app-model";
import Head from "next/head";

export type PWAHeadProps = {
  app: AppDocument;
};

const splashScreenSizes = [
  ["2048", "2732"],
  ["1668", "2224"],
  ["1536", "2048"],
  ["1125", "2436"],
  ["1242", "2208"],
  ["750", "1334"],
  ["640", "1136"],
];
export const PWAHead = ({ app }: PWAHeadProps) => {
  const splashScreenBasePath = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/apps/${app._id}`;
  const themeColor = colorsTheme.colors[app.colorScheme ?? "blue"][500];

  return (
    <Head>
      {app.logoUrl && <link rel="icon" href={app.logoUrl} sizes="any" />}
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />

      <meta name="application-name" content={app.name} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={app.name} />
      <meta name="description" content={app.description ?? ""} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content={themeColor} />

      <link rel="apple-touch-icon" href={`${app.logoUrl}`} />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href={`/api/apps/${app._id}/icon.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/api/apps/${app._id}/icon.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href={`/api/apps/${app._id}/icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/api/apps/${app._id}/icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/api/apps/${app._id}/icon.png`}
      />

      <link rel="manifest" href={`/api/apps/${app._id}/manifest.json`} />

      {splashScreenSizes.map(([width, height]) => (
        <link
          key={`${width}x${height}`}
          rel="apple-touch-startup-image"
          href={`${splashScreenBasePath}/apple_splash_${width}.png`}
          sizes={`${width}x${height}`}
        />
      ))}
    </Head>
  );
};
