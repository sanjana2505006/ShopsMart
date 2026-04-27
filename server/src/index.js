require('dotenv').config();
const app = require('./app');
const { ensureDatabase } = require('./bootstrap');

const PORT = process.env.PORT || 5001;

ensureDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start SmartShop server:', error);
        process.exit(1);
    });
