import { v4 as uuidv4 } from "uuid";

import {
  createDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addAccessControl,
  updateAccessControl,
} from "./dbHelpers.js";

import {
  hasReadAccess,
  hasWriteAccess,
  hasDeleteAccess,
  hasGrantDocumentAccess,
  hasEditDocumentAccess,
} from "./users.js";

// Create document.
export const createDocument = async ({ title, userId }) => {
  const docId = uuidv4(); // Generate a unique ID

  await createDoc({ docId, title });
  await addAccessControl({ docId, userId, role: "owner" });
};

// Get Document.
export const getDocument = async ({ docId, userId }) => {
  // Validate if user has read access to the document.
  if (!(await hasReadAccess({ docId, userId }))) {
    const error = new Error("You are not authorized to read this document.");
    error.code = "USERFRIENDLY";
    throw error;
  }

  return await getDoc(docId);
};

// Update document.
export const updateDocument = async ({ docId, userId, title }) => {
  // Validate if user has write access to the document.
  if (!(await hasWriteAccess({ docId, userId }))) {
    const error = new Error("You are not authorized to write this document.");
    error.code = "USERFRIENDLY";
    throw error;
  }

  return await updateDoc({ docId, title });
};

// Delete document.
export const deleteDocument = async ({ docId, userId }) => {
  // Validate if user has delete access to the document.
  if (!(await hasDeleteAccess({ docId, userId }))) {
    const error = new Error("You are not authorized to delete this document.");
    error.code = "USERFRIENDLY";
    throw error;
  }

  await deleteDoc({ docId });
};

// Grant document access.
export const grantDocumentAccess = async ({
  docId,
  userId,
  newDocUserInfo,
}) => {
  // Validate if user has permission to grant access to the document.
  if (!(await hasGrantDocumentAccess({ docId, userId }))) {
    const error = new Error(
      "You are not authorized to grant access to this document."
    );
    error.code = "USERFRIENDLY";
    throw error;
  }

  await addAccessControl({
    docId,
    userId: newDocUserInfo.user_id,
    role: newDocUserInfo.role,
  });
};

// Edit document access.
export const editDocumentAccess = async ({ docId, userId, newDocUserInfo }) => {
  // Validate if user has permission to grant access to the document.
  if (!(await hasEditDocumentAccess({ docId, userId }))) {
    const error = new Error(
      "You are not authorized to edit user access for this document."
    );
    error.code = "USERFRIENDLY";
    throw error;
  }

  // Need to verify if user has access to the document.

  await updateAccessControl({
    docId,
    userId: newDocUserInfo.user_id,
    role: newDocUserInfo.role,
  });
};
