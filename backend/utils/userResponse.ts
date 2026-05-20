import type { UserProps, UserResponseProps } from "../types.js";

export const formatUserResponse = (user: UserProps): UserResponseProps => {
  const response: UserResponseProps = {
    _id: user._id,
    email: user.email,
  };

  if (user.name !== undefined) {
    response.name = user.name;
  }

  if (user.avatar !== undefined) {
    response.avatar = user.avatar;
  }

  if (user.created !== undefined) {
    response.created = user.created;
  }

  return response;
};
