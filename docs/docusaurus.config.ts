import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'jsPsych',
  tagline: 'Build browser-ready experiments',
  // staticDirectories: ['docs', 'static'], // don't know how to add this without breaking the img paths
  favicon: 'img/jspsych-favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://jodeleeuw.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docusaurus-test/', // testing fork; change when moving to production

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jodeleeuw', // Usually your GitHub org/user name.
  projectName: 'docusaurus-test', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Self-hosted brand webfonts (Lexend + JetBrains Mono). See src/fonts.ts.
  clientModules: ['./src/fonts.ts'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Current Version',
              path: 'current'
            },
            '0.1': {
              label: 'Version 0.1',
              path: '0.1',
            },
            '0.0': {
              label: 'Version 0.0',
              path: '0.0',
            },
          },
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    algolia:{
      appId: 'G73E906FBW',
      apiKey: '677a628d1fa8113d588d4e5c2ae9a83d',
      indexName: 'docusaurus_jspsych',
      contextualSearch: false,
    },
    navbar: {
      title: 'jsPsych',
      logo: {
        alt: 'jsPsych Logo',
        src: 'img/jspsych-logo-no-text.svg',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          versions: ['current', '0.1', '0.0'],
          position: 'right',
        },
        { // Getting Started Tab
          // if a link is referenced in a sidebar, 
          // it will link to that page in the corresponding docSidebar type
          type: 'docSidebar',
          sidebarId: 'gettingStarted',
          position: 'left',
          label: 'Getting Started',
        },
        { // Learn Tab
          type: 'docSidebar',
          sidebarId: 'learn',
          position: 'left',
          label: 'Learn',
        },
        { // Extend Tab
          type: 'docSidebar',
          sidebarId: 'extend',
          position: 'left',
          label: 'Extend',
        },
        { // References Tab
          type: 'docSidebar',
          sidebarId: 'reference',
          position: 'left',
          label: 'References',
        },
        { // Community Tab
          type: 'docSidebar',
          sidebarId: 'community',
          position: 'left',
          label: 'Community',
        },
        { // About Tab
          type: 'docSidebar',
          sidebarId: 'about',
          position: 'left',
          label: 'About',
        },
        {
          type: 'search',
          position: 'right'
        },
        {
          href: 'https://github.com/jspsych/jspsych',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'jsPsych on GitHub',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: '/docs/current/getting-started/hello-world',
            },
            {
              label: 'Reference',
              to: '/docs/current/reference/core',
            },
            {
              label: 'Plugin Catalog',
              to: '/docs/current/reference/plugins',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Support',
              to: '/docs/current/community/support',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/jspsych/jspsych/discussions',
            },
            {
              label: 'Contribute',
              href: 'https://github.com/jspsych/jspsych-contrib',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/jspsych/jspsych',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} jsPsych contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
