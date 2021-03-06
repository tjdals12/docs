import clc from 'cli-color';
import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe(clc.bgGreen(clc.black('[ CMCODE ]')), () => {
    let server;
    let accessToken;
    let id;
    let major;
    let minorId;

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
            .catch((err) => {
                done(err);
            });
    });

    describe('Prepare', () => {
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
    });

    describe('POST /cmcodes', () => {
        it('add cmcode', (done) => {
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

                    id = ctx.body.data._id;
                    major = ctx.body.data.cdMajor;

                    expect(ctx.body.data.cdFName).to.equal('공종');
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/add', () => {
        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '기계'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    minorId = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });
    });

    describe('GET /cmcodes', () => {
        it('get cmcodes', (done) => {
            request(server)
                .get('/api/cmcodes')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /cmcodes', () => {
        it('get cdMajors', (done) => {
            request(server)
                .get('/api/cmcodes/majors')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /cmcodes/:id/minor', () => {
        it('get cmcode', (done) => {
            request(server)
                .get(`/api/cmcodes/${minorId}/minor`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(minorId);
                    done();
                });
        });
    });

    describe('GET /cmcodes/:id', () => {
        it('get cmcode', (done) => {
            request(server)
                .get(`/api/cmcodes/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });

    describe('GET /cmcodes/:major/minors', () => {
        it('get cmcode by cdMajor', (done) => {
            request(server)
                .get(`/api/cmcodes/${major}/minors`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMajor).to.equal(major);
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/edit', () => {
        it('edit cmcode', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/edit`)
                .send({
                    cdMajor: '0002',
                    cdFName: '구분'
                })
                .set('Cookie', accessToken)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data.cdMajor;

                    expect(ctx.body.data.cdFName).to.equal('구분');
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/:minorId/edit', () => {
        it('edit cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/${minorId}/edit`)
                .send({
                    cdMinor: '0002',
                    cdSName: '장치'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMinors[0].cdSName).to.equal('장치');
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/:minor/delete', () => {
        it('delete cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/${minorId}/delete`)
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMinors).have.length(1);
                    expect(ctx.body.data.cdMinors[0].effEndDt.substr(0, 10)).not.equal('9999-12-31');
                    done();
                });
        });
    });

    describe('GET /cmcodes/:major/minors/exclude', () => {
        it('get cmcode by cdMajor', (done) => {
            request(server)
                .get(`/api/cmcodes/${major}/minors/exclude`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMinors).have.length(0);
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/:minor/recovery', () => {
        it('recovery cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/${minorId}/recovery`)
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMinors).have.length(1);
                    expect(ctx.body.data.cdMinors[0].effEndDt.substr(0, 10)).to.equal('9999-12-31');
                    done();
                });
        });
    });

    describe('GET /cmcodes/:major/minors/exclude', () => {
        it('get cmcode by cdMajor', (done) => {
            request(server)
                .get(`/api/cmcodes/${major}/minors/exclude`)
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/delete', () => {
        it('delete cmcode', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/delete`)
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