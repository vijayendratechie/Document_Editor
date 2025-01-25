// Import the client
import { default as client } from "./dbClient.js";

// Get user by email.
export const getUserByEmail = async (email) => {
  try {
    const res = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return res.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
};

// Create Document.
export const createDoc = async ({ docId, title }) => {
  try {
    await client.query(
      "INSERT INTO documents (doc_id, doc_name) VALUES ($1, $2)",
      [docId, title]
    );
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
};

// Get Document by ID.
export const getDoc = async (docId) => {
  try {
    const res = await client.query(
      "SELECT * FROM documents WHERE doc_id = $1",
      [docId]
    );
    return res.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
};

// Update Document by ID.
export const updateDoc = async ({ docId, title }) => {
  try {
    const res = await client.query(
      "UPDATE documents SET doc_name = $2 WHERE doc_id = $1 RETURNING doc_id",
      [docId, title]
    );
    return res.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
};

// Delete Document by ID.
export const deleteDoc = async ({ docId }) => {
  try {
    await client.query("DELETE FROM documents WHERE doc_id = $1", [docId]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
};

export const addAccessControl = async ({ docId, userId, role }) => {
  try {
    const res = await client.query(
      "INSERT INTO document_access (doc_id, user_id, access) VALUES ($1, $2, $3)",
      [docId, userId, role]
    );
  } catch (err) {
    console.error("Error executing query", err.stack);

    // Not an ideally way to validate error, but it works for now.
    if (
      err.message ===
      `duplicate key value violates unique constraint "document_access_pkey"`
    ) {
      const error = new Error("User already has access to this document.");
      error.code = "USERFRIENDLY";
      throw error;
    }
    throw err;
  }
};

export const updateAccessControl = async ({ docId, userId, role }) => {
  try {
    const res = await client.query(
      "UPDATE document_access SET access = $3 WHERE doc_id = $1 AND user_id = $2",
      [docId, userId, role]
    );
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
};

export const getAccessControl = async ({ docId, userId }) => {
  try {
    const res = await client.query(
      "SELECT * FROM document_access WHERE doc_id=$1 AND user_id=$2",
      [docId, userId]
    );
    return res.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err;
  }
};
