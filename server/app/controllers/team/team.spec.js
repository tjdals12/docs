import clc from 'cli-color';
import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe(clc.bgGreen(clc.black('[ Team ]')), () => {
    let server;
    let part1;
    let part2;
    let accessToken;
    let id;
    let managerId;

    before((done) => {
        db.connect().then((type) => {
            console.log(clc.yellow(`    Connected ${type}`));

            server = app.listen(4000, () => {
                console.log(clc.yellow('    Server localhost:4000'));
                done();
            });
        });
    });

    after((done) => {
        db.close()
            .then(() => {
                server.close();
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    /** 공통코드(공종, 구분) 생성 및 추가 */
    describe('Cmcode preparation', () => {
        let major;

        it('add user', (done) => {
            request(server)
                .post('/api/accounts')
                .send({
                    username: 'Tester',
                    description: 'API Tester',
                    userType: 'admin',
                    userId: 'test',
                    pwd: '1234',
                    roles: [
                        '5daeaefaef365b120bab0084',
                        '5daeaefdef365b120bab0085'
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if(err) throw err;

                    expect(ctx.body.data.profile.username).to.equal('Tester');
                    expect(ctx.body.data.profile.description).to.equal('API Tester');
                    done();
                });
        });

        it('login', (done) => {
            request(server)
                .post('/api/accounts/login')
                .send({
                    userId: 'test',
                    pwd: '1234'
                })
                .expect(200)
                .end((err, ctx) => {
                    if(err) throw err;

                    accessToken = ctx.res.headers['set-cookie'][0];

                    expect(ctx.body.data).to.have.property('_id');
                    expect(ctx.body.data).to.have.property('profile');
                    done();
                });
        });

        it('add Part', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0001',
                    cdFName: '공종'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdFName).to.equal('공종');
                    done();
                });
        });

        it('add cdMinor 1', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '기계'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    part1 = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });

        it('add cdMinor 2', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0002',
                    cdSName: '장치'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    part2 = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(2);
                    done();
                });
        });
    });

    describe('POST /api/teams', () => {
        it('create team', (done) => {
            request(server)
                .post('/api/teams')
                .send({
                    part: part1,
                    teamName: '기계설계팀'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.part).instanceOf(Object);
                    expect(ctx.body.data.part._id).to.equal(part1);
                    expect(ctx.body.data.teamName).to.equal('기계설계팀');
                    expect(ctx.body.data.managers).have.length(0);
                    done();
                });
        });
    });

    describe('GET /api/teams/:id', () => {
        it('get team', (done) => {
            request(server)
                .get(`/api/teams/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.part).instanceOf(Object);
                    done();
                });
        });
    });

    describe('PATCH /api/teams/:id/edit', () => {
        it('edit team', (done) => {
            request(server)
                .patch(`/api/teams/${id}/edit`)
                .send({
                    part: part2,
                    teamName: '장치설계팀'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.part).instanceOf(Object);
                    expect(ctx.body.data.part._id).to.equal(part2);
                    expect(ctx.body.data.teamName).to.equal('장치설계팀');
                    done();
                });
        });
    });

    describe('GET /api/teams', () => {
        it('get teams', (done) => {
            request(server)
                .get('/api/teams')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).instanceOf(Array);
                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('POST /api/teams/:id/add', () => {
        it('add manager', (done) => {
            request(server)
                .post(`/api/teams/${id}/add`)
                .send({
                    name: '홍길동',
                    position: '사원',
                    effStaDt: '2019-10-26',
                    effEndDt: '9999-12-31'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    const manager = ctx.body.data.managers[0];
                    managerId = manager._id;

                    expect(ctx.body.data).instanceOf(Object);
                    expect(ctx.body.data.managers).have.length(1);
                    expect(manager.name).to.equal('홍길동');
                    expect(manager.position).to.equal('사원');
                    done();
                });
        });
    });

    describe('PATCH /api/teams/:id/edit/manager', () => {
        it('edit manager', (done) => {
            request(server)
                .patch(`/api/teams/${id}/edit/manager`)
                .send({
                    managerId: managerId,
                    name: '김준호',
                    position: '대리',
                    effStaDt: '2019-10-29',
                    effEndDt: '2019-12-23'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    const manager = ctx.body.data.managers[0];

                    expect(ctx.body.data).instanceOf(Object);
                    expect(ctx.body.data.managers).have.length(1);
                    expect(manager._id).to.equal(managerId);
                    expect(manager.name).to.equal('김준호');
                    expect(manager.position).to.equal('대리');
                    done();
                });
        });
    });
});