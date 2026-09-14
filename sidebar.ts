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
        description: 'Release notes and changelog for the Laravel Like package.',
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
        description: 'Install, configure, and understand the requirements for Laravel Like.',
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
        description: 'How to add, remove, check, count, and query interactions in your Laravel project.',
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
            description: 'Like, dislike, check, toggle, and forget interactions.',
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
            {
              type: 'doc',
              id: 'usage/toggle_interactions',
              label: '🔄 Toggle Interactions',
            },
          ],
          collapsed: false,
        },
        {
          type: 'category',
          link: {
            type: 'generated-index',
            title: 'User Traits and Interactions',
            description: 'How to use UserHasInteraction to track interactions from the user side.',
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
            description: 'Count, aggregate, and filter by interaction counts.',
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
        {
          type: 'category',
          label: 'Service API and Performance',
          items: [
            {
              type: 'doc',
              id: 'usage/like_manager',
              label: '⚡ LikeManager & Facade API',
            },
            {
              type: 'doc',
              id: 'usage/performance',
              label: '🚀 Performance',
            },
          ],
          collapsed: false,
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'Development - Laravel Like Package',
        description: 'Architecture diagrams and internal flow of the Laravel Like package.',
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
        description: 'Feature requests, issues, and troubleshooting for the Laravel Like package.',
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
    },
    {
      type: 'category',
      link: {
        type: 'generated-index',
        title: 'GitHub Source - Laravel Like Package',
        description: 'Contribute to the Laravel Like package on GitHub.',
      },
      label: 'GitHub Source',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Laravel Like Package',
          description: 'This package provides an interaction way to add like, dislike, and love features to your Laravel application.',
          href: 'https://github.com/cslant/laravel-like',
        },
      ],
    },
  ],
};
