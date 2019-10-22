import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Role ]', () => {
    let server;
    let id;

    before((done) => {
        db.connect().then((type) => {
            console.log(`Connected ${type}`);

            server = app.listen(4000, () => {
                console.log('Server location:4000');
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

    describe('POST /api/roles', () => {
        it('create role', (done) => {
            request(server)
                .post('/api/roles')
                .send({
                    to: '/',
                    name: 'Home',
                    icon: 'MdTest',
                    layout: 'MainLayout',
                    component: 'HomePage',
                    roleType: 'READ'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.to).to.equal('/');
                    expect(ctx.body.data.name).to.equal('Home');
                    expect(ctx.body.data.icon).to.equal('MdTest');
                    expect(ctx.body.data.layout).to.equal('MainLayout');
                    expect(ctx.body.data.component).to.equal('HomePage');
                    expect(ctx.body.data.roleType).to.equal('READ');
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
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.to).to.equal('/indexes');
                    expect(ctx.body.data.name).to.equal('Indexes');
                    expect(ctx.body.data.icon).to.equal('MdIndex');
                    expect(ctx.body.data.layout).to.equal('MainLayout');
                    expect(ctx.body.data.component).to.equal('IndexesPage');
                    expect(ctx.body.data.roleType).to.equal('ROOT');
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
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    const sub = ctx.body.data.sub[0];

                    expect(sub.to).to.equal('/indexes/overall');
                    expect(sub.name).to.equal('Indexes Overall');
                    expect(sub.icon).to.equal('MdOverall');
                    expect(sub.layout).to.equal('MainLayout');
                    expect(sub.component).to.equal('IndexesOverallPage');
                    expect(sub.roleType).to.equal('READ');
                    done();
                });
        });
    });
});