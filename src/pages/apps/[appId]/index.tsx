import { useRouter } from "next/router";
import Head from "next/head";

export default function AppPage() {
  const router = useRouter();
  const { appId } = router.query;

  return (
    <>
      <Head>
        {/* Link to tenant-specific manifest */}
        <link rel="manifest" href={`/apps/${appId}/manifest.json`} />
      </Head>
      <main>
        <h1>Welcome to {appId}</h1>
        <p>This is the PWA for {appId}.</p>
      </main>
    </>
  );
}
