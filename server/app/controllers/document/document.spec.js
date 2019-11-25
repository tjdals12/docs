import clc from 'cli-color';
import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe(clc.bgGreen(clc.black('[ Document ]')), () => {
    let server;
    let part;
    let documentGb;
    let vendorId;
    let accessToken;
    let id;
    let inOutId;
    let statusId;

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

    /** 공통코드(공종, 구분) 생성 및 추가 */
    describe('Cmcode preparation', () => {
        let major;
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
                    partNumber: 'G-001',
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

                    vendorId = ctx.body.data._id;

                    expect(ctx.body.data.project).to.equal(projectId);
                    expect(ctx.body.data.manager).to.equal(managerId);
                    expect(ctx.body.data.partNumber).to.equal('G-001');
                    expect(ctx.body.data.vendorName).to.equal('성민테크');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    done();
                });
        });
    });

    describe('GET /documents/search', () => {
        it('post search documents', (done) => {
            request(server)
                .post('/api/documents/search?page=1')
                .send({
                    documentGb: '',
                    documentNumber: 'G-001',
                    documentTitle: '',
                    documentRev: 'A',
                    documentStatus: '01',
                    deleteYn: 'NO',
                    holdYn: 'NO',
                    delayGb: '01',
                    regDtSta: '2000-01-01',
                    regDtEnd: '9999-12-31',
                    level: 0
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(0);
                    done();
                });
        });
    });

    describe('POST /documents', () => {
        it('add document', (done) => {
            request(server)
                .post('/api/documents')
                .send({
                    vendor: vendorId,
                    part: part,
                    documentNumber: 'ABC-DEF-G-001-003',
                    documentTitle: 'Inspection Report',
                    documentGb: documentGb,
                    documentRev: 'A',
                    officialNumber: 'ABC-DEF-T-G-001-001',
                    memo: '최초 접수'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.documentNumber).to.equal('ABC-DEF-G-001-003');
                    done();
                });
        });
    });

    describe('GET /documents', () => {
        it('get documents', (done) => {
            request(server)
                .get('/api/documents')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /documents/search', () => {
        it('post search documents', (done) => {
            request(server)
                .post('/api/documents/search?page=1')
                .send({
                    documentGb: '',
                    documentNumber: 'G-001',
                    documentTitle: '',
                    documentRev: 'A',
                    documentStatus: '01',
                    deleteYn: 'NO',
                    holdYn: 'NO',
                    regDtSta: '2000-01-01',
                    regDtEnd: '9999-12-31',
                    level: 1
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /documents/:id', () => {
        it('get document', (done) => {
            request(server)
                .get(`/api/documents/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });

    describe('PATCH /documents/:id/edit', () => {
        it('edit document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/edit`)
                .send({
                    vendor: '5d33ef877cceb91244d16fdd',
                    part: '5d33ef877cceb91244d16fd1',
                    documentNumber: 'ABC-DEF-G-001-003',
                    documentTitle: 'Drawing',
                    documentGb: '5d33ef877cceb91244d16fd2',
                    documentRev: '01',
                    level: 3,
                    officialNumber: 'ABC-DEF-T-G-001-001',
                    memo: '최초 접수'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.documentTitle).to.equal('Drawing');
                    expect(ctx.body.data.level.number).to.equal(3);
                    expect(ctx.body.data.level.description).to.equal('보통');
                    done();
                });
        });
    });

    describe('PATCH /documents/:id/delete', () => {
        it('delete document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/delete`)
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

    describe('PATCH /documents/delete', () => {
        it('delete documents', (done) => {
            request(server)
                .patch('/api/documents/delete')
                .send({
                    ids: [
                        id
                    ]
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data[0].deleteYn.reason).to.equal('일괄 삭제');
                    done();
                });
        });
    });

    describe('PATCH /documents/:id/inout', () => {
        it('In/Out document - 내부 검토요청', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '10',
                    status: '10'
                })
                .expect(200)
                .set('Cookie', accessToken)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 내부 검토완료', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '20',
                    status: '11',
                    resultCode: '01'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 검토요청', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '30',
                    officialNumber: 'ABC-DEF-T-R-001-001',
                    status: '20',
                    resultCode: '01'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 검토완료', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '40',
                    officialNumber: 'DEF-ABC-T-R-001-001',
                    status: '21',
                    resultCode: '02'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 내부 재검토요청', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '12',
                    status: '30'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 내부 재검토완료', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '22',
                    status: '31',
                    resultCode: '01'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 재검토요청', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '32',
                    officialNumber: 'ABC-DEF-T-R-001-002',
                    status: '40',
                    resultCode: '01'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 재검토완료', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '42',
                    officialNumber: 'DEF-ABC-T-R-001-002',
                    status: '41',
                    resultCode: '01'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 업체 회신', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
                    inOutGb: '90',
                    officialNumber: 'ABC-GEF-T-R-001-001',
                    status: '90',
                    resultCode: '01',
                    replyCode: '01'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    let inOut = ctx.body.data.documentInOut;
                    let status = ctx.body.data.documentStatus;

                    inOutId = inOut[inOut.length - 1]._id;
                    statusId = status[status.length - 1]._id;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.documentInOut).have.length(10);
                    expect(ctx.body.data.documentStatus).have.length(10);
                    done();
                });
        });
    });

    describe('PATCH /api/documents/:id/inout/delete', () => {
        it('Delete In/Out document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout/delete`)
                .send({
                    targetId: inOutId
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.documentInOut).have.length(9);
                    done();
                });
        });

        it('Delete Status document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout/delete`)
                .send({
                    targetId: statusId
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.documentStatus).have.length(9);
                    done();
                });
        });
    });

    describe('PATCH /api/documets/:id/hold', () => {
        it('hold document - 보류', (done) => {
            request(server)
                .patch(`/api/documents/${id}/hold`)
                .send({
                    yn: 'YES',
                    reason: 'API 테스트 - 보류'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('hold document - 보류 취소', (done) => {
            request(server)
                .patch(`/api/documents/${id}/hold`)
                .send({
                    yn: 'NO',
                    reason: 'API 테스트 - 보류 취소'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });
});