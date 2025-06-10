//imports
import express from 'express';
// import productRoutes from './routes/products.route.js'
import path from 'path';
import { fileURLToPath } from 'url';

//settings
const app = express();
app.set("PORT",5000);
//middlewares
app.use(express.json());//permite manejar archivos json

// Necesario para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos (css, js, imágenes, etc.)
app.use(express.static(path.join(__dirname, '../../frontend')));

// Ruta para index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Ruta para productos.html
app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/productos.html'));
});

// Ruta para carrito.html
app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/carrito.html'));
});

// Ruta para ticket.html
app.get('/ticket', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/ticket.html'));
});

//listener
app.listen(app.get("PORT"), ()=>{
    console.log(`Servidor corriendo en http://localhost:${app.get("PORT")}`)
});
