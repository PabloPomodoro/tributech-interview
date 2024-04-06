export interface Agents {
    isOnline: boolean,
    name: string,
    deviceType?: string,
    keyStorageType?: string,
    proofKind?: string,
    deviceId?: string,
    connectedTo?: string,
    creationDate?: Date,
    publicKey?: string,
    validFrom?: string,
    validTill?: string,
}
