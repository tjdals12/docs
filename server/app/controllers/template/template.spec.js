import clc from 'cli-color';
import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe(clc.bgGreen(clc.black('[ Template ]')), () => {
    let server;
    let templateGb1;
    let templateGb2;
    let accessToken;
    let id;

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

    describe('cmcode preparation', () => {
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
                    cdMajor: '0004',
                    cdFName: '양식 구분'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdMajor).to.equal('0004');
                    expect(ctx.body.data.cdFName).to.equal('양식 구분');
                    done();
                });
        });

        it('add cdMinor 1', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '공문'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    templateGb1 = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });

        it('add cdMinor 2', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0002',
                    cdSName: '보고서'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    templateGb2 = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(2);
                    done();
                });
        });
    });

    describe('POST /templates', () => {
        it('add template', (done) => {
            request(server)
                .post('/api/templates')
                .send({
                    templateGb: templateGb1,
                    templateName: 'Transmittal 양식',
                    templateType: 'docx',
                    templatePath: 'https://example.storage.com/sample.docx',
                    templateDescription: '사업주 송부용 Transmittal 양식'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.templateName).to.equal('Transmittal 양식');
                    expect(ctx.body.data.templateType).to.equal('docx');
                    expect(ctx.body.data.templatePath).to.equal('https://example.storage.com/sample.docx');
                    expect(ctx.body.data.templateDescription).to.equal('사업주 송부용 Transmittal 양식');
                    done();
                });
        });
    });

    describe('GET /templates', () => {
        it('get templates', (done) => {
            request(server)
                .get('/api/templates')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /templates/forselect', () => {
        it('get templates for select', (done) => {
            request(server)
                .get('/api/templates/forselect')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /templates/:id', () => {
        it('get template', (done) => {
            request(server)
                .get(`/api/templates/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });

    describe('PATCH /templates/:id/edit', () => {
        it('edit template', (done) => {
            request(server)
                .patch(`/api/templates/${id}/edit`)
                .send({
                    templateGb: templateGb2,
                    templateName: '월간보고서 양식',
                    templateType: 'xlsx',
                    templatePath: 'https://example.storage/sample.xlsx',
                    templateDescription: '월간회의용 보고서 양식(= 월간진도보고서)'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.templateGb._id).to.equal(templateGb2);
                    expect(ctx.body.data.templateName).to.equal('월간보고서 양식');
                    expect(ctx.body.data.templateType).to.equal('xlsx');
                    expect(ctx.body.data.templatePath).to.equal('https://example.storage/sample.xlsx');
                    expect(ctx.body.data.templateDescription).to.equal('월간회의용 보고서 양식(= 월간진도보고서)');
                    done();
                });
        });
    });

    describe('DELETE /templates/:id/delete', () => {
        it('delete template', (done) => {
            request(server)
                .delete(`/api/templates/${id}/delete`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).to.equal(id);
                    done();
                });
        });
    });
});