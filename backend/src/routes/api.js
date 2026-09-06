import { Router } from 'express';
import {
  getAnalytics,
  getAvailability,
  getBuildings,
  getRecommendations,
  getRooms,
  getSchedules,
} from '../controllers/apiController.js';

const router = Router();

router.get('/buildings', getBuildings);
router.get('/rooms', getRooms);
router.get('/schedules', getSchedules);
router.get('/availability', getAvailability);
router.post('/recommend', getRecommendations);
router.get('/analytics', getAnalytics);

export default router;
