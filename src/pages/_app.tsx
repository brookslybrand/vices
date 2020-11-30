import type { AppProps } from "next/app";

import "../styles/index.css";

type ComponentWithPageLayout = {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType;
  };
};

export default function App({
  Component,
  pageProps,
}: AppProps & ComponentWithPageLayout) {
  // get a page root if one was set
  const PageLayout =
    Component.PageLayout ||
    (({ children }: { children: React.ReactNode }) => <>{children}</>);

  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  );
}
