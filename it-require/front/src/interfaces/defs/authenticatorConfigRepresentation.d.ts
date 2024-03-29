/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_authenticatorconfigrepresentation
 */
export interface AuthenticatorConfigRepresentation {
    id?: string;
    alias?: string;
    config?: {
        [index: string]: string;
    };
}
export interface AuthenticationProviderRepresentation {
    id?: string;
    displayName?: string;
    description?: string;
}
