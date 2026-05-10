const prisma = require("../config/database");
const HttpError = require("../utils/httpError");

const productSelect = {
  id: true,
  name: true,
  sku: true,
  description: true,
  price: true,
  stock: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const serializeProduct = (product) => ({
  ...product,
  price: Number(product.price),
});

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const listProducts = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const search = query.search?.trim();
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
          { description: { contains: search } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(serializeProduct),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: productSelect,
  });

  if (!product) {
    throw new HttpError(404, "Product was not found.");
  }

  return serializeProduct(product);
};

const createProduct = async (payload, actorId) => {
  const { name, sku, description, price, stock = 0, isActive = true } = payload;

  if (!name || !sku || price === undefined) {
    throw new HttpError(422, "Name, SKU, and price are required.");
  }

  return serializeProduct(
    await prisma.product.create({
      data: {
        name: name.trim(),
        sku: sku.toUpperCase().trim(),
        description: description?.trim() || null,
        price,
        stock: Number(stock),
        isActive: Boolean(isActive),
        createdById: actorId,
      },
      select: productSelect,
    }),
  );
};

const updateProduct = async (id, payload) => {
  await getProductById(id);

  const data = {};

  if (payload.name !== undefined) {
    data.name = payload.name.trim();
  }

  if (payload.sku !== undefined) {
    data.sku = payload.sku.toUpperCase().trim();
  }

  if (payload.description !== undefined) {
    data.description = payload.description?.trim() || null;
  }

  if (payload.price !== undefined) {
    data.price = payload.price;
  }

  if (payload.stock !== undefined) {
    data.stock = Number(payload.stock);
  }

  if (payload.isActive !== undefined) {
    data.isActive = Boolean(payload.isActive);
  }

  return serializeProduct(
    await prisma.product.update({
      where: { id: Number(id) },
      data,
      select: productSelect,
    }),
  );
};

const deleteProduct = async (id) => {
  await getProductById(id);

  return serializeProduct(
    await prisma.product.delete({
      where: { id: Number(id) },
      select: productSelect,
    }),
  );
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
