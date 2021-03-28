module.exports = {
  title: 'React Native Youtube iframe',
  tagline:
    'A simple, light weight wrapper around the youtube iframe javascript API for react native',
  url: 'https://lonelycpp.github.io',
  baseUrl: '/react-native-youtube-iframe/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'LonelyCpp',
  projectName: 'react-native-youtube-iframe',
  themeConfig: {
    sidebarCollapsible: false,
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'React Native Youtube-iframe',
      logo: {
        alt: 'React Native Youtube-iframe Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/LonelyCpp/react-native-youtube-iframe',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    googleAnalytics: {
      trackingID: 'UA-165995640-2',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
