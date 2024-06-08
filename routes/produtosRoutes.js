const router = require("express").Router();
const Produto = require("../models/Produtos");

router.get("/todos", async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({
      error: "Erro ao buscar produtos, o servidor retornou 500.",
    });
  }
});

router.get("/porId/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findById(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.status(200).json(produto);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({
      error: "Erro ao buscar produto, verifique os dados.",
    });
  }
});

router.post("/criar", async (req, res) => {
  const { nome, descricao, cor, peso, tipo, preco } = req.body;

  const data = new Date();

  if (!nome || !preco || !descricao || !peso || !tipo) {
    return res.status(400).json({
      error: "Nome, preço, descrição, peso e tipo são obrigatórios",
    });
  }

  const produto = new Produto({
    nome,
    descricao,
    cor,
    peso,
    tipo,
    preco,
    data,
  });

  try {
    await produto.save();
    res.status(201).json({ produto });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({
      error: "Erro ao criar produto, verifique os dados.",
    });
  }
});

router.put("/atualizar/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, cor, peso, tipo, preco } = req.body;

  if (!nome || !preco || !descricao || !peso || !tipo) {
    return res.status(400).json({
      error: "Nome, preço, descrição, peso e tipo são obrigatórios",
    });
  }

  const produto = {
    nome,
    descricao,
    cor,
    peso,
    tipo,
    preco,
  };

  try {
    const produtoAtualizado = await Produto.findByIdAndUpdate(id, produto, {
      new: true,
    });

    if (!produtoAtualizado) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.status(200).json({
      produtoAtualizado,
    });
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    res.status(500).json({
      error: "Erro ao atualizar produto, verifique os dados.",
    });
  }
});

router.delete("/excluir/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const produtoExcluido = await Produto.findByIdAndDelete(id);

    if (!produtoExcluido) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.status(200).json({ produtoExcluido });
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    res.status(500).json({
      error: "Erro ao excluir produto, verifique os dados.",
    });
  }
});

module.exports = router;
