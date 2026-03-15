const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middlewares/auth');

router.get('/balance', authenticateToken, accountController.getBalance);
router.get('/statement', authenticateToken, accountController.getStatement);
router.get('/users', authenticateToken, accountController.getUsers);
router.post('/transfer', authenticateToken, accountController.transferMoney);

module.exports = router;
