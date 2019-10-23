const baseUrl = 'https://api.myradius.ru/';
const auth = 'https://api.myradius.ru/auth/';
const bugTracker = baseUrl + 'platform-bug-tracker/';
const fileStorage = baseUrl + 'files-storage/';

export const environment = {
  production: true,
  myInfoApiUrl: auth + 'users/info',
  circlesUrl: 'https://api.dev.myradius.ru/payment_request/directory/circle',
  chatApiPath: 'wss://ws.myradius.ru/realtime',
  chatHistory: 'https://api.myradius.ru/platform-test-mongo/realtime/chat_history',
  fileStorage: 'https://api.myradius.ru/files-storage/',
  taskUrl: bugTracker + 'tasks/',
  logoOrgUnitURL: fileStorage + 'pics/group',
};
