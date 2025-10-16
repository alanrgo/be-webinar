import Card from '../models/card.js';

// GET /cards
export const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => {
      res.status(500).send({ message: 'Erro ao buscar cartões', error: err.message });
    });
};

// POST /cards
export const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(card => res.status(201).send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Dados inválidos para criação do cartão', error: err.message });
      }
      res.status(500).send({ message: 'Erro ao criar cartão', error: err.message });
    });
};

// DELETE /cards/:cardId
export const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(() => {
      res.send({ message: 'Cartão deletado com sucesso' });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de cartão inválido', error: err.message });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      res.status(500).send({ message: 'Erro ao deletar cartão', error: err.message });
    });

    
};

export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'ID de cartão inválido', error: err.message });
      if (err.statusCode === 404) return res.status(404).send({ message: err.message });
      res.status(500).send({ message: 'Erro ao curtir cartão', error: err.message });
    });
};

export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, 
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'ID de cartão inválido', error: err.message });
      if (err.statusCode === 404) return res.status(404).send({ message: err.message });
      res.status(500).send({ message: 'Erro ao descurtir cartão', error: err.message });
    });
};

