export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  id: string;
}
