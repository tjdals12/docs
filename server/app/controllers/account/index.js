import Router from 'koa-router';
import * as accountCtrl from './account.ctrl';

const account = new Router();

/**
 * @swagger
 * /api/accounts:
 *  post:
 *      tags:
 *          - Account
 *      summary: 계정 추가
 *      description: 계정 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: user parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      example: ''
 *                  description:
 *                      type: string
 *                      example: ''
 *                  userType:
 *                      type: string
 *                      enum: [ 'Admin', 'Manager', 'Guest' ]
 *                      example: 'Guest'
 *                  userId:
 *                      type: string
 *                      example: ''
 *                  pwd:
 *                      type: string
 *                      example: ''
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                          format: ObjectId
 *                      profile:
 *                          thumbnail:
 *                              type: string
 *                          username:
 *                              type: string
 *                          description:
 *                              type: string
 *                          type:
 *                              type: string
 */
account.post('/', accountCtrl.create);

/**
 * @swagger
 * /api/accounts/login:
 *  post:
 *      tags:
 *          - Account
 *      summary: 로그인
 *      description: 로그인
 *      conumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: login parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: string
 *                      example: ''
 *                  pwd:
 *                      type: string
 *                      example: ''
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                          format: ObjectId
 *                      profile:
 *                          thumbnail:
 *                              type: string
 *                          username:
 *                              type: string
 *                          description:
 *                              type: string
 *                          type:
 *                              type: string
 */
account.post('/login', accountCtrl.login);

/**
 * @swagger
 * /api/accounts/check:
 *  get:
 *      tags:
 *          - Account
 *      summary: 로그인 여부 확인
 *      description: 로그인 여부 확인
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation 
 *              schema:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                          format: ObjectId
 *                      profile:
 *                          thumbnail:
 *                              type: string
 *                          username:
 *                              type: string
 *                          description:
 *                              type: string
 *                          type:
 *                              type: string
 */
account.get('/check', accountCtrl.check);

/**
 * @swagger
 * /api/accounts/logout:
 *  post:
 *      tags:
 *          - Account
 *      summary: 로그아웃
 *      description: 로그아웃
 *      responses:
 *          200:
 *              description: Successful operation
 */
account.post('/logout', accountCtrl.logout);

export default account;