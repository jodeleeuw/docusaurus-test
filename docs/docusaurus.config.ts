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
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docusaurus-test/', // change this when done testing

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'warn',

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
              label: 'Current',
              path: 'current'
            },
            '0.1': {
              label: '0.1',
              path: '0.1',
            },
            '0.0': {
              label: '0.0',
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
    navbar: {
      title: 'jsPsych',
      logo: {
        alt: 'jsPsych Logo',
        src: 'img/jspsych-logo-no-text-mono.svg',
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
          href: 'https://github.com/jspsych/jspsych',
          label: 'GitHub',
          position: 'right',
        },
      ],
      style: 'primary', // Not sure what the default stylings are, but they're probably using infima
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
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
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
