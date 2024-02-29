/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_credentialrepresentation
 */
export interface CredentialRepresentation {
    createdDate?: number;
    credentialData?: string;
    id?: string;
    priority?: number;
    secretData?: string;
    temporary?: boolean;
    type?: string;
    userLabel?: string;
    value?: string;
}
