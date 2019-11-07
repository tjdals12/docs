import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as accountCtrl from './account.ctrl';

const account = new Router();

/**a
 * @swagger
 * definitions:
 *  user:
 *      type: object
 *      required:
 *          - profile
 *          - userId
 *          - pwd
 *      properties:
 *          profile:
 *              type: object
 *              properties:
 *                  thumbnail:
 *                      type: string
 *                      example: 'https://thumbnail.url.com'
 *                  username:
 *                      type: string
 *                      example: '홍길동'
 *                  description:
 *                      type: string
 *                      example: '테스트 계정'
 *                  userType:
 *                      type: string
 *                      enum: [ 'Admin', 'Manager', 'Guest' ]
 *                      example: 'Guest'
 *          userId:
 *              type: string
 *              example: 'test'
 *          pwd:
 *              type: string
 *          history:
 *              type: array
 *              items:
 *                  type: string
 *          notifications:
 *              type: array
 *              items:
 *                  type: string
 *          deleteYn:
 *              type: object
 *              properties:
 *                  yn:
 *                      type: string    
 *                      example: 'NO'
 *                  deleteDt:
 *                      type: string
 *                      format: date-time
 *                      example: '9999-12-31 23:59:59'
 *          timemstamp:
 *              $ref: '#/definitions/timestamp'
 */

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
 *                  roles:
 *                      type: array
 *                      example: ['5daeaefaef365b120bab0084', '5daeaefdef365b120bab0085']
 *                      items:
 *                          type: string
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
 *                          type: object
 *                          properties:
 *                              thumbnail:
 *                                  type: string
 *                              username:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              type:
 *                                  type: string
 */
account.post('/', accountCtrl.create);

/**
 * @swagger
 * /api/accounts:
 *  get:
 *      tags:
 *          - Account
 *      summary: 계정 목록 조회
 *      description: 계정 목록 조회
 *      produces:
 *          - application/json
 *      parameters: 
 *          - in: query
 *            name: page
 *            description: page parameters
 *            type: string
 *            example: 1
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/user'
 */
account.get('/', accountCtrl.list);

/**
 * @swagger
 * /api/accounts/{id}:
 *  get:
 *      tags:
 *          - Account
 *      summary: 계정 조회
 *      description: 계정 조회
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: user id
 *            required: true
 *            type: string
 *            example: 5d3e4a41709a5107893bfe4c
 *      responses:
 *          200:
 *              description: Successful definitions
 *              schema:
 *                  $ref: '#/definitions/user'
 */
account.get('/:id', commonCtrl.checkObjectId, accountCtrl.one);

/**
 * @swagger
 * /api/accounts/{id}/edit:
 *  patch:
 *      tags:
 *          - Account
 *      summary: 계정 수정
 *      description: 계정 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: user id
 *            required: true
 *            type: string
 *            example: 5d3e4a41709a5107893bfe4c
 *          - in: body
 *            name: body
 *            description: edit parameters
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
 *                      example: ''
 *                      enum: [ 'Admin', 'Manager', 'Guest' ]
 *                  userId:
 *                      type: string
 *                      example: ''
 *                  roles:
 *                      type: array
 *                      example: ['5daeaf41ef365b120bab0088', '5daeaf43ef365b120bab0089']
 *                      items:
 *                          type: string
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/user'
 */
account.patch('/:id/edit', commonCtrl.checkObjectId, accountCtrl.edit);

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
account.post('/check', accountCtrl.check);

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