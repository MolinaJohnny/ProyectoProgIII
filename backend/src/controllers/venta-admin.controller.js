import { getProductById } from "../services/product.service.js";
import { Venta } from "../models/venta.model.js";
import { DetalleVenta } from "../models/detalleVenta.model.js";
import {
  getTopProductosVendidos,
  getTopVentas,
  getVentas,
} from "../services/venta.service.js";
import { Product } from "../models/product.model.js";

export const registrarVentas = async (req, res) => {
  try {
    const { ventas, clienteNombre } = req.body;
    if (!ventas || !Array.isArray(ventas) || ventas.length === 0) {
      return res.status(400).json({ message: "No hay ventas para registrar" });
    }

    // Sumar totales
    let cantidad_productos = 0;
    let precio_total = 0;
    for (const v of ventas) {
      cantidad_productos += v.cantidad;
      precio_total += v.precio * v.cantidad;

      // Actualizar stock
      const producto = await getProductById(v.id);
      if (producto) {
        producto.stock = Math.max(0, producto.stock - v.cantidad);
        if (producto.stock === 0) {
          producto.activo = false;
        }
        await producto.save();
      }
    }

    // Guarda la venta (una sola fila)
    const nuevaVenta = await Venta.create({
      usuario: clienteNombre || "Cliente",
      cantidad_productos,
      precio_total,
      fecha: new Date(),
    });

    // Guarda el detalle de productos vendidos
    for (const v of ventas) {
      await DetalleVenta.create({
        ventaId: nuevaVenta.id,
        productoId: v.id,
        cantidad: v.cantidad,
        precio_unitario: v.precio,
      });
    }

    res
      .status(201)
      .json({ message: "Venta registrada", ventaId: nuevaVenta.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar ventas", error: error.message });
  }
};

export const getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Traer el detalle de productos vendidos en esta venta
    const productosDetalle = await DetalleVenta.findAll({
      where: { ventaId: id },
      include: [{ model: Product, attributes: ["nombre"] }],
    });

    // Formatear los productos para el ticket
    const productos = productosDetalle.map((detalle) => ({
      nombre: detalle.Product ? detalle.Product.nombre : "Producto eliminado",
      cantidad: detalle.cantidad,
      precio: detalle.precio_unitario,
    }));

    res.status(200).json({ venta, productos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener venta", error: error.message });
  }
};

export const getRankingAdmin = async (req, res) => {
  try {
    const ventas = await getVentas();
    const productosVendidos = await getTopProductosVendidos();
    const ventasCaras = await getTopVentas();
    res.render("ventas_admin", { ventas, productosVendidos, ventasCaras });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};
