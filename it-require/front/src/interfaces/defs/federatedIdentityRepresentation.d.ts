/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_federatedidentityrepresentation
 */
export interface FederatedIdentityRepresentation {
    identityProvider?: string;
    userId?: string;
    userName?: string;
}
