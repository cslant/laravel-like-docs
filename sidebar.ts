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
        type: 'generated-index',
        title: 'Getting Started - Laravel Like Package',
        description: 'Let\'s get started with the Laravel Like Package.' +
          'You can also find the installation guide and the configuration guide here.',
      },
      label: 'Getting Started',
      items: [
        {
          type: 'doc',
          id: 'getting-started/requirements',
          label: '📋 Requirements',
        },
        {
          type: 'doc',
          id: 'getting-started/installation',
          label: '🔧 Installation',
        },
        {
          type: 'doc',
          id: 'getting-started/configuration',
          label: '🛠 Configuration',
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'Usage - Laravel Like Package',
        description: 'This section will guide you on how to use the Laravel Like Package. Let\'s get started with your first interaction in Laravel project!',
      },
      label: 'Usage',
      items: [
        {
          type: 'doc',
          id: 'usage/change_default_interaction',
          label: '🔄 Change Default Interaction',
        },
        {
          type: 'category',
          link: {
            type: 'generated-index',
            title: 'Basic Operations',
            description: 'This section will guide you on how to perform basic operations in the Laravel Like Package. Various operations like liking, unliking, and checking if interacted are covered here.',
          },
          label: 'Basic Operations',
          items: [
            {
              type: 'doc',
              id: 'usage/liking_content',
              label: '👍 Liking Content',
            },
            {
              type: 'doc',
              id: 'usage/unliking_content',
              label: '👎 Unliking Content',
            },
            {
              type: 'doc',
              id: 'usage/check_if_interacted',
              label: '🔍 Check if Interacted',
            },
          ],
          collapsed: false,
        },
        {
          type: 'category',
          link: {
            type: 'generated-index',
            title: 'User Traits and Interactions',
            description: 'The guide will help you to understand the user traits and interactions in the Laravel Like Package.',
          },
          label: 'User Traits and Interactions',
          items: [
            {
              type: 'doc',
              id: 'usage/user_interaction_trait',
              label: '👤 User Interaction Trait',
            },
            {
              type: 'doc',
              id: 'usage/customizing_user_interaction',
              label: '🎨 Customizing User Interaction',
            },
          ],
          collapsed: false,
        },
        {
          type: 'category',
          link: {
            type: 'generated-index',
            title: 'Like Count and Analytics',
            description: 'This section will guide you on how to count the likes and perform analytics on the interactions.',
          },
          label: 'Like Count and Analytics',
          items: [
            {
              type: 'doc',
              id: 'usage/counting_interactions',
              label: '🔢 Counting Interactions',
            },
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'Querying and Filtering',
          items: [
            {
              type: 'doc',
              id: 'usage/query_scopes',
              label: '🔍 Query Scopes',
            },
            {
              type: 'doc',
              id: 'usage/filtering_by_like_count',
              label: '🔢 Filtering by Like Count',
            },
          ],
          collapsed: false,
        },
        // {
        //   type: 'category',
        //   label: 'Events and Custom Actions',
        //   items: [
        //     'usage/like_events',
        //     'usage/custom_like_actions',
        //   ],
        // },
        // 'usage/customize_interaction_type',
        // 'usage/changing_default_settings',
        // 'usage/common_errors',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'Development - Laravel Like Package',
        description: 'This section will guide for the development of the Laravel Like Package. Let\'s get started with the development!',
      },
      label: 'Development',
      items: [
        {
          type: 'doc',
          id: 'development/laravel-like-flow',
          label: '🌊 Laravel Like Flow',
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
        description: 'Please check this section if you want to contribute to the Laravel Like package. We will be happy to accept your contributions. Let\'s make the package better together!',
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
