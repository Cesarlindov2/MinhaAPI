const express = require('express');
const fs = require('fs');
const app = express();
const ARQUIVO = 'dados.json';

app.use(express.json());

function lerDados() {
    return JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'));
}

function salvarDados(itens) {
    fs.writeFileSync(ARQUIVO, JSON.stringify(itens, null, 2));
}

app.get('/itens', (req, res) => {
    const itens = lerDados();
    res.json(itens);
});

app.post('/itens', (req, res) => {
    const itens = lerDados();
    const novo = { id: Date.now(), ...req.body };
    itens.push(novo);
    salvarDados(itens);
    res.status(201).json(novo);
});

app.get('/itens/:id', (req, res) => {
    const itens = lerDados();
    const item = itens.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item não encontrado' });
    }
});

app.put('/itens/:id', (req, res) => {
    const itens = lerDados();
    const index = itens.findIndex(i => i.id === parseInt(req.params.id));
    if (index !== -1) {
        itens[index] = { ...itens[index], ...req.body };
        salvarDados(itens);
        res.json(itens[index]);
    } else {
        res.status(404).json({ error: 'Item não encontrado' });
    }
});

app.delete('/itens/:id', (req, res) => {
    const itens = lerDados();
    const index = itens.findIndex(i => i.id === parseInt(req.params.id));
    if (index !== -1) {
        const deletado = itens.splice(index, 1);
        salvarDados(itens);
        res.json(deletado[0]);
    } else {
        res.status(404).json({ error: 'Item não encontrado' });
    }
});



app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});