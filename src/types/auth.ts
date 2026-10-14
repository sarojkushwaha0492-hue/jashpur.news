export type UserRole = 'owner' | 'admin' | 'staff';

export interface UserPermissions {
  canPublishDirectly?: boolean;
  canManageUsers?: boolean;
  canManageTicker?: boolean;
  canModerateComments?: boolean;
  canManageAds?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'suspended';
  avatar: string;
  permissions?: UserPermissions;
  createdAt: string;
  lastLogin: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ip?: string;
  timestamp: string;
}

export interface WebsiteSettings {
  websiteName: string;
  location: string;
  ownerPhone?: string;
  helplinePhone?: string;
  approvalRequired: boolean;
  breakingTickerEnabled: boolean;
  allowStaffDraftAutoSubmit: boolean;
}

