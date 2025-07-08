import { getProductById } from "../services/product.service.js";
import { Venta } from "../models/venta.model.js";
import { getVentas } from "../services/venta.service.js";

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
    // Guarda el detalle de productos en la sesión para el ticket
    req.session.ultimoTicket = {
      productos: ventas,
      usuario: clienteNombre || "Cliente",
      precio_total,
      fecha: nuevaVenta.fecha,
      ventaId: nuevaVenta.id,
    };

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
    //Trae los productos de la sesión //! REPASAR
    let productos = [];
    if (req.session.ultimoTicket && req.session.ultimoTicket.ventaId == id) {
      productos = req.session.ultimoTicket.productos;
    }
    res.status(200).json({ venta, productos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener venta", error: error.message });
  }
};

export const getVentasAdmin = async (req, res) => {
  try {
    const ventas = await getVentas();
    res.render("ventas_admin", { ventas });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};
