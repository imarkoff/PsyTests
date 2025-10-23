export interface HashedPassword {
  hash: Uint8Array<ArrayBufferLike>;
  salt: Uint8Array<ArrayBufferLike>;
}
