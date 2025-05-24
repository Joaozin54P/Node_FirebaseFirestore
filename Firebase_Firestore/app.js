const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars').engine;
const bodyParser = require('body-parser');
const post = require('./models/post');
const Handlebars = require('handlebars');
const { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const db = require("./models/firebase");

// Helper para Handlebars
Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota principal
app.get('/', (req, res) => {
    res.render('primeira_pagina');
});


app.post('/cadastrar', async (req, res) => {
  try {
    await addDoc(collection(db, "agendamentos"), {
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      origem: req.body.origem,
      saber: req.body.saber,
      tipo_consulta: req.body.tipo_consulta,
      data_consulta: req.body.data_consulta,
      hora_consulta: req.body.hora_consulta,
      observacao: req.body.observacao
    });
    res.redirect('/?sucesso=1');
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    res.status(500).send("Erro ao cadastrar.");
  }
});

app.get('/consulta', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "agendamentos"));
    const posts = [];
    querySnapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    res.render("consulta", { posts });
  } catch (error) {
    console.error("Erro ao consultar:", error);
    res.status(500).send("Erro ao consultar.");
  }
});

app.get("/editar/:id", async (req, res) => {
    try {
        const docRef = doc(db, "agendamentos", req.params.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res.status(404).send("Agendamento não encontrado.");
        }

        res.render("editar", { agendamento: { id: docSnap.id, ...docSnap.data() } });
    } catch (error) {
        res.send("Erro ao carregar dados para edição: " + error);
    }
});

app.post("/editar/:id", async (req, res) => {
    try {
        const dados = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            origem: req.body.origem,
            saber: req.body.saber,
            tipo_consulta: req.body.tipo_consulta,
            data_consulta: req.body.data_consulta,
            hora_consulta: req.body.hora_consulta,
            observacao: req.body.observacao
        };

        const docRef = doc(db, "agendamentos", req.params.id);
        await updateDoc(docRef, dados);

        res.redirect("/consulta");
    } catch (error) {
        res.send("Erro ao atualizar agendamento: " + error);
    }
});

app.get("/excluir/:id", async (req, res) => {
    try {
        const docRef = doc(db, "agendamentos", req.params.id);
        await deleteDoc(docRef);
        res.redirect("/consulta");
    } catch (error) {
        res.send("Erro ao excluir agendamento: " + error);
    }
});

app.listen(8081, () => {
    console.log('Servidor ativo na porta 8081!');
});