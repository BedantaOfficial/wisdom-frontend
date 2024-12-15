// Open a general database
export const openDatabase = (dbName, storeName, version = 1) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result); // Resolve with the database object
    };

    request.onerror = (event) => {
      reject(event.target.error); // Reject if there's an error
    };
  });
};

// Save an item to IndexedDB
export const saveItemToIndexedDB = (dbName, storeName, item) => {
  openDatabase(dbName, storeName).then((db) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.put(item); // Store the item (file, object, etc.)
    transaction.oncomplete = () => {
      console.log("Item saved to IndexedDB");
    };
    transaction.onerror = (event) => {
      console.error("Error saving item", event.target.error);
    };
  });
};

// Get an item from IndexedDB
export const getItemFromIndexedDB = (dbName, storeName, id) => {
  return new Promise((resolve, reject) => {
    openDatabase(dbName, storeName).then((db) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id); // Retrieve the item by ID

      request.onsuccess = (event) => {
        resolve(event.target.result || null); // Resolve with the item or null if not found
      };

      request.onerror = (event) => {
        reject(event.target.error); // Reject if there's an error
      };
    });
  });
};
