/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_profileinforepresentation
 */
export interface ProfileInfoRepresentation {
    name?: string;
    disabledFeatures?: string[];
    previewFeatures?: string[];
    experimentalFeatures?: string[];
}
