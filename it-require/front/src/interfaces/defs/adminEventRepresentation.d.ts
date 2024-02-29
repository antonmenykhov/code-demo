import type AuthDetailsRepresentation from "./authDetailsRepresentation.js";
export interface AdminEventRepresentation {
    authDetails?: AuthDetailsRepresentation;
    error?: string;
    operationType?: string;
    realmId?: string;
    representation?: string;
    resourcePath?: string;
    resourceType?: string;
    time?: number;
}
