import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MetaMaskProvider } from "metamask-react";
import SocketsProvider from "@/providers/SocketContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import { ReduxProviders } from "@/providers/ReduxContext";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { AlertField } from "@/components/atoms/Toast";
import AlertProvider from "@/providers/AlertContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <MetaMaskProvider>
      <ReduxProviders>
        <AlertProvider>
          <SocketsProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
              <AlertField />
            </ThemeProvider>
          </SocketsProvider>
        </AlertProvider>
      </ReduxProviders>
    </MetaMaskProvider>
  );
}
