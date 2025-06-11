import type { Innovation } from './types/innovation'

export const defaultInnovations: Innovation[] = [
  // Problems (formerly issues)
  {
    id: 'problem-1',
    title: 'API response timeout on high traffic',
    description:
      'When the system experiences high traffic, API responses are timing out after 30 seconds.',
    repository: 'api-server',
    status: 'open',
    priority: 'high',
    type: 'problem',
    relatedItems: ['solution-1'],
    createdAt: '2023-05-15',
    updatedAt: '2023-06-01'
  },
  {
    id: 'problem-2',
    title: 'Mobile layout broken on small devices',
    description:
      'The layout is not rendering correctly on devices with screen width below 320px.',
    repository: 'frontend-app',
    status: 'in-progress',
    priority: 'medium',
    type: 'problem',
    relatedItems: ['solution-2'],
    createdAt: '2023-05-20',
    updatedAt: '2023-05-28'
  },
  {
    id: 'problem-3',
    title: 'Customer data not syncing with CRM',
    description:
      'Customer data updates are not being propagated to the CRM system in real-time.',
    repository: 'integration-service',
    status: 'open',
    priority: 'critical',
    type: 'problem',
    relatedItems: ['solution-3'],
    createdAt: '2023-06-01',
    updatedAt: '2023-06-02'
  },
  {
    id: 'problem-4',
    title: 'Login fails intermittently',
    description: 'Users report intermittent login failures during peak hours.',
    repository: 'auth-service',
    status: 'in-progress',
    priority: 'high',
    type: 'problem',
    relatedItems: ['solution-4'],
    createdAt: '2023-05-10',
    updatedAt: '2023-05-25'
  },
  {
    id: 'problem-5',
    title: 'Typo in welcome email',
    description:
      'There is a typo in the welcome email that is sent to new users.',
    repository: 'notification-service',
    status: 'resolved',
    priority: 'low',
    type: 'problem',
    relatedItems: ['solution-5'],
    createdAt: '2023-05-30',
    updatedAt: '2023-06-01'
  },

  // Solutions
  {
    id: 'solution-1',
    title: 'Implement connection pooling for API',
    description:
      'Reduce timeout issues by implementing a connection pool that manages and reuses connections efficiently.',
    repository: 'api-server',
    status: 'proposed',
    type: 'solution',
    relatedItems: ['problem-1', 'solution-6'],
    createdAt: '2023-06-01'
  },
  {
    id: 'solution-2',
    title: 'Add responsive breakpoints for mobile',
    description:
      'Fix mobile layout by implementing additional breakpoints and adjusting media queries for small screens.',
    repository: 'frontend-app',
    status: 'approved',
    type: 'solution',
    relatedItems: ['problem-2'],
    createdAt: '2023-05-29'
  },
  {
    id: 'solution-3',
    title: 'Update CRM integration endpoints',
    description:
      'Resolve sync issues by updating the integration to use the new CRM API endpoints and authentication method.',
    repository: 'integration-service',
    status: 'proposed',
    type: 'solution',
    relatedItems: ['problem-3'],
    createdAt: '2023-06-02'
  },
  {
    id: 'solution-4',
    title: 'Add retry logic to authentication service',
    description:
      'Implement exponential backoff retry pattern in the authentication service to handle intermittent failures.',
    repository: 'auth-service',
    status: 'implemented',
    type: 'solution',
    relatedItems: ['problem-4'],
    createdAt: '2023-05-26'
  },
  {
    id: 'solution-5',
    title: 'Fix typo in email template',
    description:
      'Update the welcome email template to fix the typo in the greeting message.',
    repository: 'notification-service',
    status: 'implemented',
    type: 'solution',
    relatedItems: ['problem-5'],
    createdAt: '2023-06-01'
  },
  {
    id: 'solution-6',
    title: 'Add data caching to improve performance',
    description:
      'Implement Redis caching for frequently accessed data to reduce database load and improve response times.',
    repository: 'api-server',
    status: 'proposed',
    type: 'solution',
    relatedItems: ['solution-1'],
    createdAt: '2023-05-20'
  }
]
