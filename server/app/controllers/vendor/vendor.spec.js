import clc from 'cli-color';
import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe(clc.bgGreen(clc.black('[ Vendor ]')), () => {
    let server;
    let id;
    let part1;
    let part2;
    let projectId;
    let managerId;
    let accessToken;
    let personId;
    let vendorPerson;

    before((done) => {
        db.connect().then(type => {
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
            .catch((err) => {
                done(err);
            });
    });

    describe('Cmcode preparation', () => {
        var major;
        let projectGb;
        let teamId;

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

                    expect(ctx.body.data.cdMajor).to.equal('0001');
                    expect(ctx.body.data.cdFName).to.equal('공종');
                    done();
                });
        });

        it('add cdMinor', (done) => {
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

        it('add cdMinor', (done) => {
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

                    part2 = ctx.body.data.cdMinors[1];

                    expect(ctx.body.data.cdMinors).have.length(2);
                    done();
                });
        });

        it('add ProjectGb', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0000',
                    cdFName: '프로젝트 구분'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdMajor).to.equal('0000');
                    expect(ctx.body.data.cdFName).to.equal('프로젝트 구분');
                    done();
                });
        });

        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '신규'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    projectGb = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });

        it('add Project', (done) => {
            request(server)
                .post('/api/projects')
                .send({
                    projectGb: projectGb,
                    projectName: 'Methane Gas Sales & CFU/ARO2 Project',
                    projectCode: 'NCC',
                    effStaDt: '2017-03-01',
                    effEndDt: '2018-10-31',
                    client: '한화토탈',
                    clientCode: 'HTC',
                    contractor: '한화건설',
                    contractorCode: 'HENC',
                    memo: '프로젝트 설명'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    projectId = ctx.body.data._id;

                    expect(ctx.body.data.projectGb._id).to.equal(projectGb);
                    expect(ctx.body.data.projectName).to.equal('Methane Gas Sales & CFU/ARO2 Project');
                    expect(ctx.body.data.memo).to.equal('프로젝트 설명');
                    done();
                });
        });

        it('create team', (done) => {
            request(server)
                .post('/api/teams')
                .send({
                    part: part1,
                    teamName: '기계설계팀'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    teamId = ctx.body.data._id;

                    expect(ctx.body.data.part).instanceOf(Object);
                    expect(ctx.body.data.part._id).to.equal(part1);
                    expect(ctx.body.data.teamName).to.equal('기계설계팀');
                    expect(ctx.body.data.managers).have.length(0);
                    done();
                });
        });

        it('add manager', (done) => {
            request(server)
                .post(`/api/teams/${teamId}/add`)
                .send({
                    name: '홍길동',
                    position: '사원',
                    effStaDt: '2019-10-26',
                    effEndDt: '9999-12-31'
                })
                .set('Cookie', accessToken)
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

    describe('POST /vendors', () => {
        it('add vendor', (done) => {
            request(server)
                .post('/api/vendors')
                .send({
                    project: projectId,
                    manager: managerId,
                    vendorGb: '01',
                    countryCd: '01',
                    part: part1,
                    partNumber: 'R-001',
                    vendorName: '성민테크',
                    officialName: 'SMT',
                    itemName: 'Centrifugal Pump',
                    effStaDt: '2019-07-10',
                    effEndDt: '2020-04-02',
                    persons: [
                        {
                            name: '이성민',
                            position: '사원',
                            email: 'lll2slll@naver.com',
                            contactNumber: '010-4143-3664',
                            task: '개발'
                        },
                        {
                            name: '김준철',
                            position: '대리',
                            email: 'jsteel@naver.com',
                            contactNumber: '010-4421-5238',
                            task: '개발'
                        },

                        {
                            name: '박희영',
                            position: '사원',
                            email: 'phzer0o@naver.com',
                            contactNumber: '010-2361-1642',
                            task: '개발'
                        }
                    ]
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;
                    vendorPerson = ctx.body.data.vendorPerson.map((person) => ({
                        _id: person._id,
                        name: person.name,
                        position: person.position,
                        task: person.task,
                        email: person.email,
                        contactNumber: person.contactNumber
                    }));

                    expect(ctx.body.data.project).to.equal(projectId);
                    expect(ctx.body.data.manager).to.equal(managerId);
                    expect(ctx.body.data.part._id).to.equal(part1);
                    expect(ctx.body.data.partNumber).to.equals('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    expect(ctx.body.data.itemName).to.equal('Centrifugal Pump');
                    done();
                });
        });
    });

    describe('GET /vendors/:id', () => {
        it('getVendor', (done) => {
            request(server)
                .get(`/api/vendors/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    done();
                });
        });
    });

    describe('GET /vendors', () => {
        it('get vendors', (done) => {
            request(server)
                .get('/api/vendors')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /vendors/forselect', () => {
        it('get vendors for select', (done) => {
            request(server)
                .get('/api/vendors/forselect')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('POST /vendors/search', () => {
        it('search vendors', (done) => {
            request(server)
                .post('/api/vendors/search')
                .send({
                    vendorGb: '01',
                    countryCd: '01',
                    part: part1,
                    partNumber: 'R-001',
                    vendorName: '성민테크',
                    officialName: 'SMT',
                    effStaDt: '2019-05-10',
                    effEndDt: '2020-05-02',
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('POST /vendors/:id/add', () => {
        it('add person', (done) => {
            request(server)
                .post(`/api/vendors/${id}/add`)
                .send({
                    persons: [{
                        index: 0,
                        name: '이성민',
                        position: '사원',
                        email: 'lll2slll@naver.com',
                        contactNumber: '010-4143-3664',
                        task: '개발'
                    }]
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    personId = ctx.body.data.vendorPerson[0]._id;

                    expect(ctx.body.data.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(4);
                    done();
                });
        });
    });

    describe('PATCH /vendors/:id/:personId/delete', () => {
        it('delete person', (done) => {
            request(server)
                .patch(`/api/vendors/${id}/${personId}/delete`)
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    done();
                });
        });
    });

    describe('PATCH /vendors/:id/edit', () => {
        before(() => {
            vendorPerson.splice(0, 1);
            vendorPerson[0] = {
                _id: vendorPerson[0]._id,
                name: '홍길동',
                position: '이사',
                task: '조달',
                email: 'hong@naver.com',
                contactNumber: '010-5678-5678'
            };
            vendorPerson[1] = {
                _id: vendorPerson[1]._id,
                name: '대장금',
                position: '상무',
                task: '조달',
                email: 'bigold@naver.com',
                contactNumber: '010-1234-1234'
            };
        });

        it('edit vendor', (done) => {
            request(server)
                .patch(`/api/vendors/${id}/edit`)
                .send({
                    project: projectId,
                    manager: managerId,
                    vendorGb: '02',
                    countryCd: '02',
                    part: part2,
                    partNumber: 'S-001',
                    vendorName: '성은테크',
                    officialName: 'SUT',
                    itemName: 'Boiler Feed Water Pump',
                    effStaDt: '2019-08-20',
                    effEndDt: '2020-02-21',
                    vendorPerson: vendorPerson
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.project).to.equal(projectId);
                    expect(ctx.body.data.manager).to.equal(managerId);
                    expect(ctx.body.data.part._id).to.equal(part2);
                    expect(ctx.body.data.partNumber).to.equal('S-001');
                    expect(ctx.body.data.vendorName).to.equal('성은테크');
                    expect(ctx.body.data.officialName).to.equal('SUT');
                    expect(ctx.body.data.itemName).to.equal('Boiler Feed Water Pump');
                    expect(ctx.body.data.vendorPerson).have.length(2);
                    done();
                });
        });
    });

    describe('PATCH /vendors/:id/delete', () => {
        it('delete vendor', (done) => {
            request(server)
                .patch(`/api/vendors/${id}/delete`)
                .send({
                    yn: 'YES',
                    reason: 'mocha 테스트 삭제'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.deleteYn.yn).to.equal('YES');
                    done();
                });
        });
    });
});