export type EventType =
  | 'LOGIN'
  | 'LOGIN_ERROR'
  | 'REGISTER'
  | 'REGISTER_ERROR'
  | 'LOGOUT'
  | 'LOGOUT_ERROR'
  | 'CODE_TO_TOKEN'
  | 'CODE_TO_TOKEN_ERROR'
  | 'CLIENT_LOGIN'
  | 'CLIENT_LOGIN_ERROR'
  | 'REFRESH_TOKEN'
  | 'REFRESH_TOKEN_ERROR'
  | 'VALIDATE_ACCESS_TOKEN'
  | 'VALIDATE_ACCESS_TOKEN_ERROR'
  | 'INTROSPECT_TOKEN'
  | 'INTROSPECT_TOKEN_ERROR'
  | 'FEDERATED_IDENTITY_LINK'
  | 'FEDERATED_IDENTITY_LINK_ERROR'
  | 'REMOVE_FEDERATED_IDENTITY'
  | 'REMOVE_FEDERATED_IDENTITY_ERROR'
  | 'UPDATE_EMAIL'
  | 'UPDATE_EMAIL_ERROR'
  | 'UPDATE_PROFILE'
  | 'UPDATE_PROFILE_ERROR'
  | 'UPDATE_PASSWORD'
  | 'UPDATE_PASSWORD_ERROR'
  | 'UPDATE_TOTP'
  | 'UPDATE_TOTP_ERROR'
  | 'VERIFY_EMAIL'
  | 'VERIFY_EMAIL_ERROR'
  | 'REMOVE_TOTP'
  | 'REMOVE_TOTP_ERROR'
  | 'REVOKE_GRANT'
  | 'REVOKE_GRANT_ERROR'
  | 'SEND_VERIFY_EMAIL'
  | 'SEND_VERIFY_EMAIL_ERROR'
  | 'SEND_RESET_PASSWORD'
  | 'SEND_RESET_PASSWORD_ERROR'
  | 'SEND_IDENTITY_PROVIDER_LINK'
  | 'SEND_IDENTITY_PROVIDER_LINK_ERROR'
  | 'RESET_PASSWORD'
  | 'RESET_PASSWORD_ERROR'
  | 'RESTART_AUTHENTICATION'
  | 'RESTART_AUTHENTICATION_ERROR'
  | 'INVALID_SIGNATURE'
  | 'INVALID_SIGNATURE_ERROR'
  | 'REGISTER_NODE'
  | 'REGISTER_NODE_ERROR'
  | 'UNREGISTER_NODE'
  | 'UNREGISTER_NODE_ERROR'
  | 'USER_INFO_REQUEST'
  | 'USER_INFO_REQUEST_ERROR'
  | 'IDENTITY_PROVIDER_LINK_ACCOUNT'
  | 'IDENTITY_PROVIDER_LINK_ACCOUNT_ERROR'
  | 'IDENTITY_PROVIDER_LOGIN'
  | 'IDENTITY_PROVIDER_LOGIN_ERROR'
  | 'IDENTITY_PROVIDER_FIRST_LOGIN'
  | 'IDENTITY_PROVIDER_FIRST_LOGIN_ERROR'
  | 'IDENTITY_PROVIDER_POST_LOGIN'
  | 'IDENTITY_PROVIDER_POST_LOGIN_ERROR'
  | 'IDENTITY_PROVIDER_RESPONSE'
  | 'IDENTITY_PROVIDER_RESPONSE_ERROR'
  | 'IDENTITY_PROVIDER_RETRIEVE_TOKEN'
  | 'IDENTITY_PROVIDER_RETRIEVE_TOKEN_ERROR'
  | 'IMPERSONATE'
  | 'IMPERSONATE_ERROR'
  | 'CUSTOM_REQUIRED_ACTION'
  | 'CUSTOM_REQUIRED_ACTION_ERROR'
  | 'EXECUTE_ACTIONS'
  | 'EXECUTE_ACTIONS_ERROR'
  | 'EXECUTE_ACTION_TOKEN'
  | 'EXECUTE_ACTION_TOKEN_ERROR'
  | 'CLIENT_INFO'
  | 'CLIENT_INFO_ERROR'
  | 'CLIENT_REGISTER'
  | 'CLIENT_REGISTER_ERROR'
  | 'CLIENT_UPDATE'
  | 'CLIENT_UPDATE_ERROR'
  | 'CLIENT_DELETE'
  | 'CLIENT_DELETE_ERROR'
  | 'CLIENT_INITIATED_ACCOUNT_LINKING'
  | 'CLIENT_INITIATED_ACCOUNT_LINKING_ERROR'
  | 'TOKEN_EXCHANGE'
  | 'TOKEN_EXCHANGE_ERROR'
  | 'PERMISSION_TOKEN'
  | 'PERMISSION_TOKEN_ERROR'
