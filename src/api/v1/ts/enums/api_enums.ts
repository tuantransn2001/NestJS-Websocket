export enum API_PATH {
  get_chat_token = 'api/admin/create-token-api',
  admin_login = 'api/admin/login',
  student_login = 'api/admin/student',
  search_list_user = 'api/admin/search-list-user',
  search_user_by_name = 'api/admin/search-user-by-name',
}
export enum STATUS_MESSAGE {
  SUCCESS = 'Success',
  CONFLICT = 'Conflict',
  NOT_FOUND = 'Not Found',
  SERVER_ERROR = 'Server Error',
  NO_CONTENT = 'No Content',
  UN_AUTHORIZE = 'Unauthorize',
  BAD_REQUEST = 'Bad Request',
  NOT_ACCEPTABLE = 'Not Acceptable',
  SERVICE_UNAVAILABLE = 'Service Unavailable',
  METHOD_NOT_ALLOW = 'Method Not Allow',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity Exception',
}

export enum STATUS_CODE {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  GONE = 410,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  INTERNAL_SERVER_ERROR = 500,
}
