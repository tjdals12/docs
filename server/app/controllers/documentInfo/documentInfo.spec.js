import clc from 'cli-color';
import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe(clc.bgGreen(clc.black('[ Document Info ]')), () => {
    let server;
    let id;
    let vendorId;
    let accessToken;

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

    describe('Vendor preparation', () => {
        let major;
        let part;
        let documentGb;
        let projectGb;
        let projectId;
        let teamId;
        let managerId;

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
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    part = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });

        it('add documentGb', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0002',
                    cdFName: '구분'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdFName).to.equal('구분');
                    done();
                });
        });

        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '공통'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    documentGb = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
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
                    part: part,
                    teamName: '기계설계팀'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    teamId = ctx.body.data._id;

                    expect(ctx.body.data.part).instanceOf(Object);
                    expect(ctx.body.data.part._id).to.equal(part);
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

        it('add vendor', (done) => {
            request(server)
                .post('/api/vendors')
                .send({
                    project: projectId,
                    manager: managerId,
                    vendorGb: '01',
                    countryCd: '01',
                    part: part,
                    partNumber: 'R-002',
                    vendorName: '주연테크',
                    officialName: 'JYR',
                    itemName: 'Chemical Injection Pump',
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

                    vendorId = ctx.body.data._id;

                    expect(ctx.body.data.project).to.equal(projectId);
                    expect(ctx.body.data.manager).to.equal(managerId);
                    expect(ctx.body.data.part._id).to.equal(part);
                    expect(ctx.body.data.partNumber).to.equals('R-002');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    expect(ctx.body.data.itemName).to.equal('Chemical Injection Pump');
                    done();
                });
        });

        it('create document index', (done) => {
            request(server)
                .post('/api/documentindexes')
                .send({
                    vendor: vendorId,
                    list: [
                        {
                            documentNumber: 'VP-NCC-R-001-001',
                            documentTitle: 'Vendor Print Index & Schedule',
                            documentGb: documentGb,
                            plan: '2019-09-23'
                        },
                        {
                            documentNumber: 'VP-NCC-R-001-002',
                            documentTitle: 'Sub-Vendor List',
                            documentGb: documentGb,
                            plan: '2019-09-23'
                        },
                        {
                            documentNumber: 'VP-NCC-R-001-003',
                            documentTitle: 'Overall Schedule',
                            documentGb: documentGb,
                            plan: '2019-09-23'
                        }
                    ]
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data.list[0]._id;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(3);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.list[0].documentGb.cdSName).to.equal('공통');
                    done();
                });
        });
    });

    describe('GET /documentinfos', () => {
        it('get documentInfos', (done) => {
            request(server)
                .get('/api/documentinfos')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).to.have.length(3);
                    done();
                });
        });
    });

    describe('GET /documentinfos/:id', () => {
        it('get documentInfo', (done) => {
            request(server)
                .get(`/api/documentinfos/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.documentTitle).to.equal('Vendor Print Index & Schedule');
                    done();
                });
        });
    });

    describe('GET /documentinfos/search', () => {
        it('get search documentInfos', (done) => {
            request(server)
                .post('/api/documentinfos/search')
                .send({
                    vendor: '',
                    documentNumber: '',
                    documentTitle: 'Schedule',
                    documentGb: ''
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(2);
                    done();
                });
        });
    });

    describe('GET /documentinfos/{vendor}/latest', () => {
        it('get latest documents', (done) => {
            request(server)
                .get(`/api/documentinfos/${vendorId}/latest`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(3);
                    done();
                });
        });
    });
});