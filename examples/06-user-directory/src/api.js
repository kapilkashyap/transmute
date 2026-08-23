// Simulated backend: an in-memory directory with artificial latency and a server-side rule.
const NETWORK_DELAY_MS = 350;

let directory = [
    {
        id: 'u-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 31,
        status: 'active',
        contacts: ['+91-99999-99999', '080-1234-5678'],
        profile: { city: 'Hyderabad', score: 91 }
    },
    {
        id: 'u-2',
        name: 'Asha Gupta',
        email: 'asha@example.com',
        age: 29,
        status: 'draft',
        contacts: ['+91-90000-00000'],
        profile: { city: 'Pune', score: 76 }
    },
    {
        id: 'u-3',
        name: 'Shreya Iyer',
        email: 'shreya@example.com',
        age: 26,
        status: 'archived',
        contacts: ['+91-80000-00000', '044-2222-3333'],
        profile: { city: 'Chennai', score: 88 }
    }
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchUsers() {
    await wait(NETWORK_DELAY_MS);
    return directory.map((user) => ({ ...user }));
}

async function fetchUser(id) {
    await wait(NETWORK_DELAY_MS);
    const found = directory.find((user) => user.id === id);
    if (!found) {
        throw new Error(`User ${id} not found`);
    }
    return { ...found };
}

async function saveUser(id, payload) {
    await wait(NETWORK_DELAY_MS);

    // Server-side check that the client model doesn't enforce, to show the API boundary rejecting bad data too.
    if (payload.profile && Number(payload.profile.score) < 0) {
        throw new Error('Server rejected update: score cannot be negative');
    }

    directory = directory.map((user) => (user.id === id ? { ...payload, id } : user));
    return { ...payload, id, savedAt: new Date().toISOString() };
}

window.UD = window.UD || {};
window.UD.fetchUsers = fetchUsers;
window.UD.fetchUser = fetchUser;
window.UD.saveUser = saveUser;
