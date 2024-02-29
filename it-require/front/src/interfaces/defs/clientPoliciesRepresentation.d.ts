import type ClientPolicyRepresentation from "./clientPolicyRepresentation.js";
/**
 * https://www.keycloak.org/docs-api/15.0/rest-api/#_clientpoliciesrepresentation
 */
export interface ClientPoliciesRepresentation {
    policies?: ClientPolicyRepresentation[];
}
