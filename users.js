import { getUserByEmail, getAccessControl } from "./dbHelpers.js";

const ACCESS_CONTROL = {
  read: ["read"],
  write: ["read", "edit", "share"],
  owner: [],
};

export const getUser = async (email) => {
  const user = await getUserByEmail(email);
  return user;
};

export const validateUserExists = async (email) => {
  const user = await getUser(email);
  if (user.length) {
    return true;
  }
  return false;
};

export const isDocumentOwner = async ({ docId, userId }) => {
  const userAccess = await getAccessControl({ docId, userId });
  if (userAccess.length && userAccess[0].access === "owner") {
    return true;
  }
  return false;
};

export const hasDeleteAccess = async ({ docId, userId }) => {
  return await isDocumentOwner({ docId, userId });
};

export const hasReadAccess = async ({ docId, userId }) => {
  const userAccess = await getAccessControl({ docId, userId });

  if (!userAccess.length) {
    return false;
  }
  const access = userAccess[0].access;

  if (access === "owner" || ACCESS_CONTROL[access].includes("read")) {
    return true;
  }
  return false;
};

export const hasWriteAccess = async ({ docId, userId }) => {
  const userAccess = await getAccessControl({ docId, userId });
  if (!userAccess.length) {
    return false;
  }
  const access = userAccess[0].access;
  if (access === "owner" || ACCESS_CONTROL[access].includes("edit")) {
    return true;
  }
  return false;
};

export const hasGrantDocumentAccess = async ({ docId, userId }) => {
  const userAccess = await getAccessControl({ docId, userId });
  if (!userAccess.length) {
    return false;
  }
  const access = userAccess[0].access;
  if (access === "owner" || ACCESS_CONTROL[access].includes("share")) {
    return true;
  }
  return false;
};

export const hasEditDocumentAccess = async ({ docId, userId }) => {
  return await isDocumentOwner({ docId, userId });
};
