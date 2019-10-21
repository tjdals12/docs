import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as roleCtrl from './role.ctrl';

const role = new Router();

/**
 * @swagger
 * definitions:
 *  role:
 *      type: object
 *      required:
 *          - to
 *          - name
 *          - icon
 *          - layout
 *          - component
 *          - roleType
 *      properties:
 *          to:
 *              type: string
 *          name:
 *              type: string
 *          icon:
 *              type: string
 *          layout:
 *              type: string
 *          component:
 *              type: string
 *          roleType:
 *              type: string
 *              enum: ['READ', 'WRITE', 'ROOT']
 */

/**
 * @swagger
 * /api/roles:
 *  get:
 *      tags:
 *          - Role
 *      summary: 권한 목록 조회
 *      description: 권한 목록 조회
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/role'
 */
role.get('/', roleCtrl.list);

/**
 * @swagger
 * /api/roles:
 *  post:
 *      tags:
 *          - Role
 *      summary: 권한 생성
 *      description: 권한 생성
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: role paramters
 *            required: true
 *            type: object
 *            schema:
 *              type: object
 *              properties:
 *                  to:
 *                      type: string
 *                      example: ''
 *                  name:
 *                      type: string
 *                      example: ''
 *                  icon:
 *                      type: string
 *                      example: ''
 *                  layout:
 *                      type: string
 *                      example: ''
 *                  component:
 *                      type: string
 *                      example: ''
 *                  roleType:
 *                      type: string
 *                      enum: [ 'READ', 'WRITE', 'ROOT' ]
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/role'
 */
role.post('/', roleCtrl.create);

/**
 * @swagger
 * /api/roles/{id}/add:
 *  patch:
 *      tags:
 *          - Role
 *      summary: 권한 추가
 *      description: 권한 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: role id
 *            required: true
 *            type: string
 *            example: ''
 *          - in: body
 *            name: body
 *            description: role paramters
 *            required: true
 *            type: object
 *            schema:
 *              type: object
 *              properties:
 *                  to:
 *                      type: string
 *                      example: ''
 *                  name:
 *                      type: string
 *                      example: ''
 *                  icon:
 *                      type: string
 *                      example: ''
 *                  layout:
 *                      type: string
 *                      example: ''
 *                  component:
 *                      type: string
 *                      example: ''
 *                  roleType:
 *                      type: string
 *                      enum: [ 'READ', 'WRITE' ]
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/role'
 */
role.patch('/:id/add', commonCtrl.checkObjectId, roleCtrl.add);

export default role;