import express from 'express';
import fixedWindowRouter from '../modules/routes';

const router = express.Router({});
router.use('/', fixedWindowRouter);
export default router;
