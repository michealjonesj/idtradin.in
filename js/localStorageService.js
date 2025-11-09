/**
 * LocalStorage Service
 * Handles all data persistence using browser localStorage
 */

const STORAGE_KEYS = {
  USERS: 'b2b_users',
  PRODUCTS: 'b2b_products',
  ORDERS: 'b2b_orders',
  INVOICES: 'b2b_invoices',
  MILESTONES: 'b2b_milestones',
  NOTIFICATIONS: 'b2b_notifications',
};

// Initialize default data if not exists
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultAdmin = {
      _id: generateId(),
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      companyName: 'Admin Company',
      contactPerson: 'Admin User',
      phone: '',
      address: '',
      isActive: true,
      totalSpend: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultAdmin]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const defaultProducts = [
      {
        _id: generateId(),
        name: 'Electrical Wire 2.5mm',
        description: 'High-quality electrical wire for residential and commercial use',
        imageUrl: '',
        price: 150.00,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: generateId(),
        name: 'PVC Pipe 1 inch',
        description: 'Durable PVC pipe for plumbing applications',
        imageUrl: '',
        price: 200.00,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: generateId(),
        name: 'Circuit Breaker 20A',
        description: 'Standard circuit breaker for electrical panels',
        imageUrl: '',
        price: 350.00,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MILESTONES)) {
    const defaultMilestones = [
      {
        _id: generateId(),
        milestoneAmount: 100000,
        rewardDescription: 'Premium Tool Kit',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: generateId(),
        milestoneAmount: 500000,
        rewardDescription: 'Gift Voucher ₹10,000',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(defaultMilestones));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getItems(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function addItem(key, item) {
  const items = getItems(key);
  const newItem = {
    ...item,
    _id: item._id || generateId(),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(newItem);
  setItems(key, items);
  return newItem;
}

function updateItem(key, id, updates) {
  const items = getItems(key);
  const index = items.findIndex((item) => item._id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  setItems(key, items);
  return items[index];
}

function deleteItem(key, id) {
  const items = getItems(key);
  const filtered = items.filter((item) => item._id !== id);
  setItems(key, filtered);
  return true;
}

function findItem(key, id) {
  const items = getItems(key);
  return items.find((item) => item._id === id);
}

function findItems(key, predicate) {
  const items = getItems(key);
  return items.filter(predicate);
}

const localStorageService = {
  getUsers: () => getItems(STORAGE_KEYS.USERS),
  getUser: (id) => findItem(STORAGE_KEYS.USERS, id),
  getUserByEmail: (email) => findItems(STORAGE_KEYS.USERS, (u) => u.email === email)[0],
  addUser: (user) => addItem(STORAGE_KEYS.USERS, user),
  updateUser: (id, updates) => updateItem(STORAGE_KEYS.USERS, id, updates),
  deleteUser: (id) => deleteItem(STORAGE_KEYS.USERS, id),

  getProducts: () => getItems(STORAGE_KEYS.PRODUCTS),
  getProduct: (id) => findItem(STORAGE_KEYS.PRODUCTS, id),
  addProduct: (product) => addItem(STORAGE_KEYS.PRODUCTS, product),
  updateProduct: (id, updates) => updateItem(STORAGE_KEYS.PRODUCTS, id, updates),
  deleteProduct: (id) => deleteItem(STORAGE_KEYS.PRODUCTS, id),

  getOrders: () => getItems(STORAGE_KEYS.ORDERS),
  getOrder: (id) => findItem(STORAGE_KEYS.ORDERS, id),
  getOrdersByPartner: (partnerId) => findItems(STORAGE_KEYS.ORDERS, (o) => o.partnerId === partnerId),
  addOrder: (order) => addItem(STORAGE_KEYS.ORDERS, order),
  updateOrder: (id, updates) => updateItem(STORAGE_KEYS.ORDERS, id, updates),

  getInvoices: () => getItems(STORAGE_KEYS.INVOICES),
  getInvoice: (id) => findItem(STORAGE_KEYS.INVOICES, id),
  getInvoiceByOrder: (orderId) => findItems(STORAGE_KEYS.INVOICES, (i) => i.orderId === orderId)[0],
  getInvoicesByPartner: (partnerId) => findItems(STORAGE_KEYS.INVOICES, (i) => i.partnerId === partnerId),
  addInvoice: (invoice) => addItem(STORAGE_KEYS.INVOICES, invoice),
  updateInvoice: (id, updates) => updateItem(STORAGE_KEYS.INVOICES, id, updates),

  getMilestones: () => getItems(STORAGE_KEYS.MILESTONES),
  getMilestone: (id) => findItem(STORAGE_KEYS.MILESTONES, id),
  addMilestone: (milestone) => addItem(STORAGE_KEYS.MILESTONES, milestone),
  updateMilestone: (id, updates) => updateItem(STORAGE_KEYS.MILESTONES, id, updates),
  deleteMilestone: (id) => deleteItem(STORAGE_KEYS.MILESTONES, id),

  getNotifications: () => getItems(STORAGE_KEYS.NOTIFICATIONS),
  addNotification: (notification) => addItem(STORAGE_KEYS.NOTIFICATIONS, notification),
  updateNotification: (id, updates) => updateItem(STORAGE_KEYS.NOTIFICATIONS, id, updates),
};

// Initialize on load
if (typeof window !== 'undefined') {
  initializeStorage();
}

