const themeConfig = {
  titleSuffix: " | Join.com",
  logo: <h4 className="m-0">Join.com</h4>,
  head: (
    <>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta
        name="description"
        content="Explore advice and explanations for all of our features, and discover new tips and tricks to get the most out of your subscription."
      />
      <meta
        name="og:description"
        content="Explore advice and explanations for all of our features, and discover new tips and tricks to get the most out of your subscription."
      />
      <meta name="og:title" content="Join Calendar" />
      <meta name="apple-mobile-web-app-title" content="Join Calendar" />

      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/join-favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/join-favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
      <meta name="msapplication-TileColor" content="#ff0000" />
      <meta name="theme-color" content="#ffffff" />
    </>
  ),
  search: true,
  prevLinks: true,
  nextLinks: true,
  footer: true,
  footerText: <>© {new Date().getFullYear()} JOIN Solutions AG. All rights reserved.</>,
};

export default themeConfig;
