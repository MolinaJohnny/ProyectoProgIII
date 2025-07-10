export const paginacion = (req, res, next) => {
  let { limit, offset } = req.query;
  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);

  // Valores por defecto si no vienen en la query o son NaN
  if (isNaN(limit) || limit <= 0) limit = 12;
  if (isNaN(offset) || offset < 0) offset = 0;

  req.query.limit = limit;
  req.query.offset = offset;
  next();
};
