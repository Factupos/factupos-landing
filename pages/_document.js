import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta name="facebook-domain-verification" content="u8is3rp7ejoyvpk7ucrzj344qy2ykc" />
        <link rel="icon" href="/Factuposlogo.ico" />
        <title>FactuPOS</title>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
