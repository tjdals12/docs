import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as dashboardCtrl from './dashboard.ctrl';

const dashboard = new Router();

/**
 * @swagger
 * /api/dashboards/{id}/widgets:
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
 *            example: '5d89c8be523cbf13cd173729'
 *      responses:
 *          200:
 *              description: Successful operation
 */
dashboard.get('/:id/widgets', commonCtrl.checkObjectId, dashboardCtrl.getWidgetDatas);

/**
 * @swagger
 * /api/dashboards/{id}/vendors:
 *  get:
 *      tags:
 *          - Dashboard
 *      summary: 대시보드 데이터 조회 - 업체
 *      description: 대시보드 데이터 조회 - 업체
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: project id
 *            required: true
 *            type: string
 *            example: '5d89c8be523cbf13cd173729'
 *      responses:
 *          200:
 *              description: Successful operation
 */
dashboard.get('/:id/vendors', commonCtrl.checkObjectId, dashboardCtrl.getVendorDatas);

export default dashboard;