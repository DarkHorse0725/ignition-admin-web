import { MongoDocument } from "../base";

export interface User extends MongoDocument {
  email: string;
  fullName: string;
  role: string;
  id: string;
  _id: string;
  status: 'active' | 'INACTIVE';
  totalResetPasswordInDay: number;
  isNew?: boolean;
}

export interface UserFormValue {
  email: string;
  name: string;
  role: string;
}

export interface UserLoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  userStatus?: string;
  user2FaStatus?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface UserList {
  data: User[];
  total: number;
}

export interface UserUpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface LoginFormValue {
  email: string;
  password: string;
}

export interface ResetPasswordFormValues {
  password: string;
  cfPassword: string;
}
