import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as dashboardCtrl from './dashboard.ctrl';

const dashboard = new Router();

/**
 * @swagger
 * /api/dashboards/{id}:
 *  get:
 *      tags:
 *          - Dashboard
 *      summary: 대시보드 데이터 조회
 *      description: 대시보드 데이터 조회
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: project id
 *            required: true
 *            type: string
 *            example: ''
 *      responses:
 *          200:
 *              description: Successful operation
 */
dashboard.get('/:id', commonCtrl.checkObjectId, dashboardCtrl.getDatas);

export default dashboard;