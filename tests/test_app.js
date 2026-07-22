require('dotenv').config({
    path: '.env'
});
const App = require('../src/app');
(async () => {
    const app = new App();
    await app.start();
})();