import { celebrate, errors, Joi, Segments } from 'celebrate';
import express from 'express';
import { sendFrame } from './controller';

const router = express.Router({});

router.post(
  '/_send',
  celebrate({
    [Segments.BODY]: Joi.object({
      id: Joi.string().required(),
      data: Joi.number().required(),
    }).required(),
  }),
  sendFrame
);
router.use(errors());
export default router;
