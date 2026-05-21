const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createRecord(setter, record) {
  await delay();
  setter((previous) => [record, ...previous]);
  return record;
}

export async function updateRecord(setter, id, patch) {
  await delay();
  setter((previous) => previous.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  return { id, ...patch };
}

export async function removeRecord(setter, id) {
  await delay();
  setter((previous) => previous.filter((item) => item.id !== id));
  return { id };
}

export function resetCampusStorage() {
  if (typeof window === 'undefined') return;
  Object.keys(localStorage)
    .filter((key) => key.startsWith('campus-connect:') || key === 'cc-theme')
    .forEach((key) => localStorage.removeItem(key));
}
