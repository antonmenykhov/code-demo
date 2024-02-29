/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_globalrequestresult
 */
export interface GlobalRequestResult {
    successRequests?: string[];
    failedRequests?: string[];
}
