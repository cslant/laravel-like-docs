module.exports = {
  telegramGitNotifierSidebar: [
    'introduction',
    {
      type: 'category',
      link: {
        type: 'generated-index',
        description: 'This section will give you a brief overview of the project and its features.',
      },
      label: 'Prologue',
      items: [
        'prologue/releases',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        description: 'Please check this section if you have any problems with the bot or you want to request a new feature.',
      },
      label: 'Support',
      items: [
        'support/issues',
        'support/feature-requests',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        description: 'Please check this section if you want to contribute to the Laravel Like project.',
      },
      label: 'GitHub Source',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Laravel Like Package',
          description: 'This package provides an interaction way to add like 👍, dislike 👎, and love ❤️ features to your Laravel application.',
          href: 'https://github.com/cslant/laravel-like',
        },
      ],
    },
  ],
};
