const baseUrl = 'https://api.dev.myradius.ru/';
const auth = 'https://api.dev.myradius.ru/auth/';
const bugTracker = baseUrl + 'platform-bug-tracker/';
const fileStorage = baseUrl + 'files-storage/';


export const environment = {
  production: false,
  myInfoApiUrl: auth + 'users/info',
  circlesUrl: 'https://api.dev.myradius.ru/payment_request/directory/circle',
  chatApiPath: 'wss://ws.dev.myradius.ru/realtime',
  chatHistory: 'https://api.dev.myradius.ru/platform-test-mongo/realtime/chat_history',
  fileStorage: 'https://api.dev.myradius.ru/files-storage/',
  taskUrl: bugTracker + 'tasks/',
  logoOrgUnitURL: fileStorage + 'pics/group',
};
