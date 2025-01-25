import express from "express";
import bodyParser from "body-parser";

import { validateUserExists, getUser } from "./users.js";
import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  grantDocumentAccess,
  editDocumentAccess,
} from "./document.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple route
app.get("/", async (req, res) => {
  res.send("Hello, Express!");
});

app.post("/doc", async (req, res) => {
  try {
    console.log("Input: ", req.body); // Will be a parsed JSON object

    if (!req.body.email || !req.body.title) {
      return res.status(400).send({ error: "Missing email or title." });
    }

    const email = req.body.email;
    const title = req.body.title;

    if (!(await validateUserExists(email))) {
      return res.status(400).send({ error: "User does not exists." });
    }

    const user = (await getUser(email))[0];
    await createDocument({ title, userId: user.user_id });

    return res.status(200).send({ message: "Document created successfully." });
  } catch (err) {
    console.log("===error: ", err);
    if (err.code === "USERFRIENDLY") {
      const message = err.message;
      return res.status(404).send({ error: message });
    }
    return res.status(404).send({ error: "Something went wrong." });
  }
});

app.get("/doc", async (req, res) => {
  try {
    console.log("Input: ", req.query); // Will be a parsed JSON object

    if (!req.query.docId || !req.query.email) {
      return res.status(400).send({ error: "Missing document id or email." });
    }

    const docId = req.query.docId;
    const email = req.query.email;

    if (!(await validateUserExists(email))) {
      return res.status(400).send({ error: "User does not exists." });
    }

    const user = (await getUser(email))[0];
    const document = await getDocument({ docId, userId: user.user_id });

    if (document.length) {
      return res.status(200).send({
        document: {
          title: document[0].doc_name,
        },
      });
    } else {
      return res.status(400).send({ error: "Document does not exists." });
    }
  } catch (err) {
    console.log("===error: ", err);
    if (err.code === "USERFRIENDLY") {
      const message = err.message;
      return res.status(404).send({ error: message });
    }
    return res.status(404).send({ error: "Something went wrong." });
  }
});

app.put("/doc", async (req, res) => {
  try {
    console.log("Input: ", req.query.docId, req.body); // Will be a parsed JSON object

    if (!req.query.docId) {
      return res.status(400).send({ error: "Missing document id." });
    }

    if (!req.body.email || !req.body.title) {
      return res.status(400).send({ error: "Missing email or title." });
    }

    const docId = req.query.docId;
    const email = req.body.email;
    const title = req.body.title;

    if (!(await validateUserExists(email))) {
      return res.status(400).send({ error: "User does not exists." });
    }

    const user = (await getUser(email))[0];
    const document = await updateDocument({
      docId,
      userId: user.user_id,
      title,
    });

    if (document.length) {
      return res
        .status(200)
        .send({ message: "Document updated successfully." });
    } else {
      return res.status(400).send({ error: "Document does not exists." });
    }
  } catch (err) {
    console.log("===error: ", err);
    if (err.code === "USERFRIENDLY") {
      const message = err.message;
      return res.status(404).send({ error: message });
    }
    return res.status(404).send({ error: "Something went wrong." });
  }
});

app.delete("/doc", async (req, res) => {
  try {
    console.log("Input: ", req.query); // Will be a parsed JSON object

    if (!req.query.docId || !req.query.email) {
      return res.status(400).send({ error: "Missing document id or email." });
    }

    const docId = req.query.docId;
    const email = req.query.email;

    if (!(await validateUserExists(email))) {
      return res.status(400).send({ error: "User does not exists." });
    }

    const user = (await getUser(email))[0];
    await deleteDocument({ docId, userId: user.user_id });
    return res.status(200).send({ message: "Document deleted successfully." });
  } catch (err) {
    console.log("===error: ", err);
    if (err.code === "USERFRIENDLY") {
      const message = err.message;
      return res.status(404).send({ error: message });
    }
    return res.status(404).send({ error: "Something went wrong." });
  }
});

app.post("/doc/access", async (req, res) => {
  try {
    console.log("Input: ", req.query); // Will be a parsed JSON object

    if (!req.query.docId) {
      return res.status(400).send({ error: "Missing document id." });
    }

    if (!req.body.email || !req.body.access.length) {
      return res
        .status(400)
        .send({ error: "Missing email or access information." });
    }

    const docId = req.query.docId;
    const email = req.body.email;

    // Currently implementing only for 1 user per request. Can be extended to multiple users.
    const access = req.body.access[0];

    if (
      !(
        (await validateUserExists(email)) ||
        (await validateUserExists(access.email))
      )
    ) {
      return res.status(400).send({ error: "User does not exists." });
    }

    const user = (await getUser(email))[0];
    const newDocUser = (await getUser(access.email))[0];
    const newDocUserInfo = {
      user_id: newDocUser.user_id,
      role: access.role,
    };
    await grantDocumentAccess({ docId, userId: user.user_id, newDocUserInfo });
    return res.status(200).send({ message: "Access granted successfully." });
  } catch (err) {
    console.log("===error: ", err);
    if (err.code === "USERFRIENDLY") {
      const message = err.message;
      return res.status(404).send({ error: message });
    }
    return res.status(404).send({ error: "Something went wrong." });
  }
});

app.put("/doc/access", async (req, res) => {
  try {
    console.log("Input: ", req.query); // Will be a parsed JSON object

    if (!req.query.docId) {
      return res.status(400).send({ error: "Missing document id." });
    }

    if (!req.body.email || !req.body.access.length) {
      return res
        .status(400)
        .send({ error: "Missing email or access information." });
    }

    const docId = req.query.docId;
    const email = req.body.email;

    // Currently implementing only for 1 user per request. Can be extended to multiple users.
    const access = req.body.access[0];

    if (
      !(
        (await validateUserExists(email)) ||
        (await validateUserExists(access.email))
      )
    ) {
      return res.status(400).send({ error: "User does not exists." });
    }

    const user = (await getUser(email))[0];
    const newDocUser = (await getUser(access.email))[0];
    const newDocUserInfo = {
      user_id: newDocUser.user_id,
      role: access.role,
    };
    await editDocumentAccess({ docId, userId: user.user_id, newDocUserInfo });
    return res.status(200).send({ message: "Access granted successfully." });
  } catch (err) {
    console.log("===error: ", err);
    if (err.code === "USERFRIENDLY") {
      const message = err.message;
      return res.status(404).send({ error: message });
    }
    return res.status(404).send({ error: "Something went wrong." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
