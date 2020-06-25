let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = ({ target }) => {
  const db = target.result;
  db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;
  
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = ({ target }) => {
  console.log(`Error encountered: ${target.errorCode}`);
}

function saveRecord(data) {
  console.log(data);
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  store.add(data);
}

function checkDatabase() {
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a transaction on pending db
        const transaction = db.transaction(['pending'], 'readwrite');
        // access pending object store
        const store = transaction.objectStore('pending');
        // clear all items in store
        store.clearAll();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);