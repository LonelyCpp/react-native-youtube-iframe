module.exports = {
  title: 'React Native Youtube iframe',
  tagline:
    'A simple, light weight wrapper around the youtube iframe javascript API for react native',
  url: 'https://lonelycpp.github.io/react-native-youtube-iframe/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'LonelyCpp',
  projectName: 'react-native-youtube-iframe',
  themeConfig: {
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
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'about',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/LonelyCpp/react-native-youtube-iframe/edit/master/doc/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
