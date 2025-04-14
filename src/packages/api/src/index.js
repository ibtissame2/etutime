import { createApiClient } from './openapi.json.client';

const api = createApiClient('/api', { validate: 'none' });

export { createApiClient, api };
