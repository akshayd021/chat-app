import { ScreenProvider } from "@/context/ScreenContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ScreenProvider >

      <Component {...pageProps} />
    </ScreenProvider>

  )
}
