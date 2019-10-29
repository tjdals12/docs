import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as teamCtrl from './team.ctrl';

const team = new Router();

/**
 * @swagger
 * definitions:
 *  manager:
 *      type: object
 *      required:
 *          - name
 *          - position
 *      properties:
 *          name:
 *              type: string
 *          position:
 *              type: string
 *          effStaDt:
 *              type: string
 *              format: date-time
 *          effEndDt:
 *              type: string
 *              format: date-time
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 *  team:
 *      type: object
 *      required:
 *          - team
 *      properties:
 *          part:
 *              type: string
 *          teamName:
 *              type: string
 *          managers:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/manager'
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/teams:
 *  post:
 *      tags:
 *          - Team
 *      summary: 팀 생성
 *      description: 팀 생성
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: team parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  part:
 *                      type: string
 *                      example: '5db4615c55e63f0e010f119d'
 *                  teamName:
 *                      type: string
 *                      example: '기계설계팀'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/team'
 */
team.post('/', teamCtrl.create);

/**
 * @swagger
 * /api/teams:
 *  get:
 *      tags:
 *          - Team
 *      summary: 팀 목록 조회
 *      description: 팀 목록 조회
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: page
 *            description: page number
 *            type: string
 *            example: 1
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/team'
 */
team.get('/', teamCtrl.list);

/**
 * @swagger
 * /api/teams/forselect:
 *  get:
 *      tags:
 *          - Team
 *      summary: 팀 목록 조회 (For select)
 *      description: 팀 목록 조회 (For select)
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
 *                      teamName:
 *                          type: project
 *                      managers:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/manager'
 */
team.get('/forselect', teamCtrl.listForSelect);

/**
 * @swagger
 * /api/teams/{id}:
 *  get:
 *      tags:
 *          - Team
 *      summary: 팀 조회
 *      description: 팀 조회
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: team id
 *            required: true
 *            type: string
 *            example: '5db4615c55e63f0e010f119d'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/team'
 */
team.get('/:id', commonCtrl.checkObjectId, teamCtrl.one);

/**
 * @swagger
 * /api/teams/{id}/edit:
 *  patch:
 *      tags:
 *          - Team
 *      summary: 팀 수정
 *      description: 팀 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: team id
 *            required: true
 *            type: string
 *            example: '5db4615c55e63f0e010f119d'
 *          - in: body
 *            name: body
 *            description: edit parameters
 *            required: true        
 *            schema:
 *              type: object
 *              properties:
 *                  part:
 *                      type: string
 *                      example: '5db4615c55e63f0e010f119d'
 *                  teamName:
 *                      type: string
 *                      example: '장치설계팀'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/team'
 */
team.patch('/:id/edit', commonCtrl.checkObjectId, teamCtrl.edit);

/**
 * @swagger
 * /api/teams/{id}/delete:
 *  delete:
 *      tags:
 *          - Team
 *      summary: 팀 삭제
 *      description: 팀 삭제
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: team id
 *            required: true
 *            type: string
 *            example: '5db4615c55e63f0e010f119d'
 *      responses:
 *          200:
 *              description: Successful operation
 */
team.delete('/:id/delete', commonCtrl.checkObjectId, teamCtrl.deleteTeam);

/**
 * @swagger
 * /api/teams/{id}/manager:
 *  get:
 *      tags:
 *          - Team
 *      summary: 담당자 조회
 *      description: 담당자 조회
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: manager id
 *            rquired: true
 *            type: string
 *            example: '5db537851a4fa00ee8d5458b'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                      part:
 *                          $ref: '#/definitions/cdminor'
 *                      teamName:
 *                          type: string
 *                      manager:
 *                          $ref: '#/definitions/manager'
 */
team.get('/:id/manager', commonCtrl.checkObjectId, teamCtrl.oneManager);

/**
 * @swagger
 * /api/teams/{id}/add:
 *  post:
 *      tags:
 *          - Team
 *      summary: 담당자 추가
 *      description: 담당자 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: team id
 *            required: true
 *            type: string
 *            example: '5db4615c55e63f0e010f119d'
 *          - in: body
 *            name: body
 *            description: manager parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      example: '홍길동'
 *                  position:
 *                      type: string
 *                      example: '사원'
 *                  effStaDt:
 *                      type: string
 *                      example: '2019-10-26'
 *                  effEndDt:
 *                      type: string
 *                      example: '9999-12-31'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/team'
 */
team.post('/:id/add', commonCtrl.checkObjectId, teamCtrl.add);

/**
 * @swagger
 * /api/teams/{id}/edit/manager:
 *  patch:
 *      tags:
 *          - Team
 *      summary: 담당자 수정
 *      description: 담당자 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: team id
 *            required: true
 *            type: string
 *            example: '5db4615c55e63f0e010f119d'
 *          - in: body
 *            name: body
 *            description: manager edit parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  managerId:
 *                      type: string
 *                      example: '5db4615c55e63f0e010f119d'
 *                  name:
 *                      type: string
 *                      example: '김준호'
 *                  position:
 *                      type: string
 *                      example: '대리'
 *                  effStaDt:
 *                      type: string
 *                      example: '2019-10-29'
 *                  effEndDt:
 *                      type: string
 *                      example: '2019-12-21'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/team'
 */
team.patch('/:id/edit/manager', commonCtrl.checkObjectId, teamCtrl.editManager);

/**
 * @swagger
 * /api/teams/{id}/delete/manager:
 *  patch:
 *      tags:
 *          - Team
 *      summary: 담당자 삭제
 *      description: 담당자 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: team id
 *            required: true
 *            type: string
 *            example: '5db4615c55e63f0e010f119d'
 *          - in: body
 *            name: body
 *            description: delete parameters
 *            schema:
 *              type: object
 *              properties:
 *                  managerId:
 *                      type: string
 *                      example: '5db4615c55e63f0e010f119d'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/team'
 */
team.patch('/:id/delete/manager', commonCtrl.checkObjectId, teamCtrl.deleteManager);

export default team;