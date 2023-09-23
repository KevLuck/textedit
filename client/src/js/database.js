import { openDB } from "idb";

const initdb = async () =>
  openDB("social-network", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("thoughts")) {
        console.log("social-network database already exists");
        return;
      }
      db.createObjectStore("thoughts", {
        keyPath: "id",
        autoIncrement: true,
      });
      console.log("social-network database created");
    },
  });

// PUT method
export const putThought = async (thought) => {
  const socialNetworkDB = await openDB("social-network", 1);
  const tx = socialNetworkDB.transaction("thoughts", "readwrite");
  const store = tx.objectStore("thoughts");
  const request = store.put(thought);
  const result = await request;
  console.log("Thought saved to the database", result);
};

// GET method
export const getThoughts = async () => {
  const socialNetworkDB = await openDB("social-network", 1);
  const tx = socialNetworkDB.transaction("thoughts", "readonly");
  const store = tx.objectStore("thoughts");
  const request = store.getAll();
  const result = await request;
  console.log("result.value", result);
  return result;
};

// DELETE method
export const deleteThought = async (thoughtId) => {
  const socialNetworkDB = await openDB("social-network", 1);
  const tx = socialNetworkDB.transaction("thoughts", "readwrite");
  const store = tx.objectStore("thoughts");
  const request = store.delete(thoughtId);
  const result = await request;
  console.log("Thought deleted from the database", result);
};

// SEARCH method
export const searchThoughts = async (searchTerm) => {
  const socialNetworkDB = await openDB("social-network", 1);
  const tx = socialNetworkDB.transaction("thoughts", "readonly");
  const store = tx.objectStore("thoughts");
  const request = store.index("content").openCursor(searchTerm);
  const results = [];
  while (const cursor = await request.continue()) {
    results.push(cursor.value);
  }
  console.log("search results", results);
  return results;
};

// GET USER FEED method
export const getUserFeed = async (userId) => {
  const socialNetworkDB = await openDB("social-network", 1);
  const tx = socialNetworkDB.transaction("thoughts", "readonly");
  const store = tx.objectStore("thoughts");
  const index = store.index("author");
  const request = index.openCursor(userId);
  const results = [];
  while (const cursor = await request.continue()) {
    results.push(cursor.value);
  }
  console.log("user feed results", results);
  return results;
};

initdb();
