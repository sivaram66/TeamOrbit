export interface UpdateMemberRoleInput {
  role: 'member' | 'admin'
}

export interface TransferOwnershipInput {
  newOwnerId: string
}