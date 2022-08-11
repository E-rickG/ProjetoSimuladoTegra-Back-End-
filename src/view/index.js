import express from 'express';
import {
  listProducts,
  insertProducts,
  FindProductsById,
  UpdateProducts,
  DeleteProducts
} from '../controllers/productsController.js';
const app = express();

export const url = "http://localhost:1000/api"

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");// dentro do '*' poderia ser qual site poderia fazer a requisiçao.

  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

  res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");

  next();

})

app.get('/api/ping', (request, response) => {
    response.send({
        message: "pong"
    })
});
app.use(express.json());
app.get('/api/products', listProducts);
app.post('/api/products', insertProducts);
app.get('/api/products/:id', FindProductsById);
app.put('/api/products/:id', UpdateProducts);
app.delete('/api/products/:id', DeleteProducts);

app.listen(1000, () => {
    console.log("Está rodando na porta 1000 :) ")
})