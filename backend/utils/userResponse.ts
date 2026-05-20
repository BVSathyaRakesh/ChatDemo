import type { UserProps, UserResponseProps } from "../types";

export const formatUserResponse = (user: UserProps): UserResponseProps => {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    created: user.created,
  };
};
