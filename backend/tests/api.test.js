const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Simular o servidor backend para testes
const { db } = require('../database.test');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Copiar rotas do server.js real (simplificado para o teste)
app.get("/api/status", (req, res) => {
    db.get(`SELECT value FROM system_status WHERE key = 'status'`, (err, rowStatus) => {
        db.get(`SELECT value FROM system_status WHERE key = 'qr'`, (err, rowQr) => {
            res.json({ status: rowStatus?.value, qr: rowQr?.value });
        });
    });
});

app.get("/api/knowledge", (req, res) => {
    db.all("SELECT * FROM conhecimento", [], (err, rows) => res.json(rows));
});

describe('Backend API Endpoints', () => {
    it('GET /api/status should return disconnected and empty QR initially', async () => {
        const res = await request(app).get('/api/status');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'disconnected');
        expect(res.body).toHaveProperty('qr', '');
    });

    it('GET /api/knowledge should return an empty array initially', async () => {
        const res = await request(app).get('/api/knowledge');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(0);
    });

    it('Should handle 404 for unknown routes', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toEqual(404);
    });
});
