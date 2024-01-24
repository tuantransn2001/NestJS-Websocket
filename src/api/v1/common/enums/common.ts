export enum ProviderName {
  MONGOOSE_CONNECTION = 'MONGOOSE_CONNECTION',
  KNEX_CONNECTION = 'KNEX_CONNECTION',
}

export enum ModelName {
  // ? No SQL
  CONVERSATION = 'Conversation',
  NOTIFICATION = 'Notification',
  LOCAL_FILE = 'LocalFile',
  // ? SQL
  USER = 'User',
  HEALTH_CHECK = 'HealthCheck',
}
