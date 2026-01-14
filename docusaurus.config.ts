import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A Textbook by Panaversity',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://muhammad-anas35.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // Changed to root for direct access
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'muhammad-anas35', // Usually your GitHub org/user name.
  projectName: 'RAGai', // Usually your repo name.

  onBrokenLinks: 'throw',

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
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/muhammad-anas35/RAGai/tree/main/',
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
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Panaversity Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          href: 'https://github.com/muhammad-anas35',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          to: '/auth/signin',
          label: 'Sign In',
          position: 'right',
        },
        {
          to: '/auth/signup',
          label: 'Sign Up',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Textbook',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Chapter 1: Foundations',
              to: '/docs/physical-ai-book/intro/foundations',
            },
            {
              label: 'Chapter 2: ROS 2',
              to: '/docs/physical-ai-book/chapter2/ros2-architecture',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Portfolio Website',
              href: 'https://muhammad-anas-portfolio1.vercel.app/',
            },
            {
              label: 'Twitter profile',
              href: 'https://x.com/muhammad_anas35',
            },
            {
              label: 'Learning Channel',
              href: 'https://www.youtube.com/@panaverse',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/muhammad-anas35/RAGai',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/muhammad-anas35/',
            },
            {
              label: 'Instagram',
              href: 'https://www.instagram.com/muhammad_anas35/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RAGai All rights reserved by Muhammad Anas Asif. `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
