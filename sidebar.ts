module.exports = {
  LaravelLikePackageSidebar: [
    {
      type: 'doc',
      id: 'introduction',
      label: '👋 Introduction',
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'Prologue - Laravel Like Package',
        description: 'This section will give you a brief overview of the project and its features. Let\'s get started with the Laravel Like Package.',
      },
      label: 'Prologue',
      items: [
        {
          type: 'doc',
          id: 'prologue/releases',
          label: '🚀 Release Notes',
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      link: {
        title: 'Support - Laravel Like Package',
        type: 'generated-index',
        description: 'Please check this section if you have any problems with the bot or you want to request a new feature. We will be happy to help you!',
      },
      label: 'Support',
      items: [
        {
          type: 'doc',
          id: 'support/feature-requests',
          label: '🚀 Feature Requests',
        },
        {
          type: 'doc',
          id: 'support/issues',
          label: '🐛 Issues',
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'GitHub Source - Laravel Like Package',
        description: 'Please check this section if you want to contribute to the Laravel Like project. We will be happy to accept your contributions. Let\'s make the package better together!',
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
