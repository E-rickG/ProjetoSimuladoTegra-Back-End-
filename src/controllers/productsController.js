import { application, query, request, response } from "express";
import { openDatabase  } from "../database.js";
import express from 'express';
const app = express();

export const listProducts = async (request ,response) => {
    let pagina = request.query['page'];
    let ordem = request.query['order'];
    let filtro = request.query['filter'];
    let categoria = request.query['category'];
    const precoMax = request.query['max'];
    const precoMin = request.query['min'];
    var Npagina = pagina-1;
    const db = await openDatabase();
    if ((ordem==null)&&(filtro==null)&&(categoria==null)) {
        const products = await db.all(`
        SELECT * FROM products
        LIMIT 10 OFFSET `+Npagina+`
        `);
        db.close();
        response.send({
            data: products,
            pages: Number(pagina)
        });
    }
    else if(ordem==null){
        const products = await db.all(`
        SELECT * FROM products WHERE
        title LIKE '%`+filtro+`%' OR
        description LIKE '%`+filtro+`%' OR
        category LIKE '%`+filtro+`%' OR
        category LIKE '%`+categoria+`%'
        LIMIT 10 OFFSET `+Npagina+`
        `);
        db.close();
        response.send({
            data: products,
            pages: Number(pagina)
        });
    }
    else if ((ordem!=null)&&(filtro==null)&&(categoria==null)) {
        const products = await db.all(`
        SELECT * FROM products 
        ORDER BY id `+ordem+` 
        LIMIT 10 OFFSET `+Npagina+`
        `);
        db.close();
        response.send({
            data: products,
            pages: Number(pagina)
        });
    }
    else if(ordem!=null) {
        const products = await db.all(`
        SELECT * FROM products WHERE 
        title LIKE '%`+filtro+`%' OR
        description LIKE '%`+filtro+`%' OR
        category LIKE '%`+filtro+`%' OR
        category LIKE '%`+categoria+`%'
        ORDER BY id `+ordem+` 
        LIMIT 10 OFFSET `+Npagina+`
        `);
        db.close();
        response.send({
            data: products,
            pages: Number(pagina)
        });
    }
}


export const insertProducts = async (request,response) => {
    const { title, price, description, image, category } = request.body;
    const db = await openDatabase();
    const data = await db.run(`
    INSERT INTO products (title, price, description, image, category)
    VALUES (?, ?, ?, ?, ?)
    `, [title, price, description, image, category]);
    db.close();
    response.send({
        id: data.lastID,
        title,
        price,
        description,
        image,
        category
    });
}

export const FindProductsById = async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const productId = await db.get(`
    SELECT * FROM products 
    WHERE id = ?
    `, [id]);
    db.close();
    response.send(productId || {});
}

export const UpdateProducts = async (request, response) => {
    const { title, price, description, image, category } = request.body;
    const { id } = request.params;
    const db = await openDatabase();
    const product = await db.get(`
    SELECT * FROM products WHERE id = ?
    `, [id]);
    if(product) {
        const data = await db.run(`
        UPDATE products
          SET title = ?,
              price = ?,
              description = ?,
              image = ?,
              category = ?
        WHERE id = ?
        `, [title, price, description, image, category, id]);
        db.close();
        response.send({
            id,
            title,
            price,
            description,
            image,
            category
        });
        return;
    }
    db.close();
    response.send(product || {});
}

export const DeleteProducts = async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const del = await db.run(`
    DELETE FROM products
    WHERE ID = ?
    `, [id]);
    db.close();
    response.send({
        id,
        message: `Produto ${id} removido`,
    });
}