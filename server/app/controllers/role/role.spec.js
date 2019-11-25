import clc from 'cli-color';
import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe(clc.bgGreen(clc.black('[ Role ]')), () => {
    let server;
    let accessToken;
    let id;

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

    describe('POST /api/roles', () => {
        it('create role', (done) => {
            request(server)
                .post('/api/roles')
                .send({
                    to: '/',
                    name: 'Home',
                    icon: 'MdTest',
                    layout: 'MainLayout',
                    component: 'HomePage'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.to).to.equal('/');
                    expect(ctx.body.data.name).to.equal('Home');
                    expect(ctx.body.data.icon).to.equal('MdTest');
                    expect(ctx.body.data.layout).to.equal('MainLayout');
                    expect(ctx.body.data.component).to.equal('HomePage');
                    expect(ctx.body.data.roleId).haveOwnProperty('READ');
                    expect(ctx.body.data.roleId).haveOwnProperty('WRITE');
                    done();
                });
        });
    });

    describe('GET /api/roles', () => {
        it('get roles', (done) => {
            request(server)
                .get('/api/roles')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('POST /api/roles', () => {
        it('create role', (done) => {
            request(server)
                .post('/api/roles')
                .send({
                    to: '/indexes',
                    name: 'Indexes',
                    icon: 'MdIndex',
                    layout: 'MainLayout',
                    component: 'IndexesPage'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.to).to.equal('/indexes');
                    expect(ctx.body.data.name).to.equal('Indexes');
                    expect(ctx.body.data.icon).to.equal('MdIndex');
                    expect(ctx.body.data.layout).to.equal('MainLayout');
                    expect(ctx.body.data.component).to.equal('IndexesPage');
                    done();
                });
        });
    });

    describe('PATCH /api/roles/:id/add', () => {
        it('add role', (done) => {
            request(server)
                .patch(`/api/roles/${id}/add`)
                .send({
                    to: '/indexes/overall',
                    name: 'Indexes Overall',
                    icon: 'MdOverall',
                    layout: 'MainLayout',
                    component: 'IndexesOverallPage'
                })
                .set('Cookie', accessToken)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    const sub = ctx.body.data.sub[0];

                    expect(sub.to).to.equal('/indexes/overall');
                    expect(sub.name).to.equal('Indexes Overall');
                    expect(sub.icon).to.equal('MdOverall');
                    expect(sub.layout).to.equal('MainLayout');
                    expect(sub.component).to.equal('IndexesOverallPage');
                    expect(sub.roleId).haveOwnProperty('READ');
                    expect(sub.roleId).haveOwnProperty('WRITE');
                    done();
                });
        });
    });
});