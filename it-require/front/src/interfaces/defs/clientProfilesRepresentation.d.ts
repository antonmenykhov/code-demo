import type ClientProfileRepresentation from "./clientProfileRepresentation.js";
/**
 * https://www.keycloak.org/docs-api/15.0/rest-api/#_clientprofilesrepresentation
 */
export interface ClientProfilesRepresentation {
    globalProfiles?: ClientProfileRepresentation[];
    profiles?: ClientProfileRepresentation[];
}
