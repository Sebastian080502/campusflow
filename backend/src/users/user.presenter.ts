import { Role } from "../domain/request-policy";

export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface AssigneeOption {
  id: string;
  fullName: string;
  role: Role;
}

export function toPublicUser(user: {
  id: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
}): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role as Role,
    active: user.active,
  };
}

export function toAssigneeOption(user: {
  id: string;
  fullName: string;
  role: string;
}): AssigneeOption {
  return {
    id: user.id,
    fullName: user.fullName,
    role: user.role as Role,
  };
}
