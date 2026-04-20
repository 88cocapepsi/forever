import express from 'express';
import Product from '../models/Product.js';

const productRouter = express.Router();

const MENU_SEED_DATA = [
  // COFFEE
  { name: 'Cà phê đen', price: 20000, category: 'coffee', unit: 'ly' },
  { name: 'Cà phê sữa', price: 23000, category: 'coffee', unit: 'ly' },
  { name: 'Bạc xỉu', price: 23000, category: 'coffee', unit: 'ly' },
  { name: 'Cà phê đá xay', price: 30000, category: 'coffee', unit: 'ly' },
  { name: 'Cà phê đá xay bạc hà', price: 30000, category: 'coffee', unit: 'ly' },
  { name: 'Cà phê sữa bạc hà', price: 28000, category: 'coffee', unit: 'ly' },
  { name: 'Cà phê latte', price: 33000, category: 'coffee', unit: 'ly' },
  { name: 'Matcha latte', price: 33000, category: 'coffee', unit: 'ly' },

  // MILK
  { name: 'Sữa tươi đá/nóng', price: 25000, category: 'milk', unit: 'ly' },
  { name: 'Sữa tươi trân châu', price: 28000, category: 'milk', unit: 'ly' },
  { name: 'Sữa tươi cà phê', price: 28000, category: 'milk', unit: 'ly' },
  { name: 'Sữa chanh sữa tắc', price: 28000, category: 'milk', unit: 'ly' },
  { name: 'Sâm dứa sữa sâm', price: 28000, category: 'milk', unit: 'ly' },
  { name: 'Dứa sữa đá xay', price: 28000, category: 'milk', unit: 'ly' },
  { name: 'Matcha đá xay', price: 33000, category: 'milk', unit: 'ly' },

  // CACAO
  { name: 'Cacao nóng/đá', price: 28000, category: 'cacao', unit: 'ly' },
  { name: 'Cacao sữa dầm', price: 30000, category: 'cacao', unit: 'ly' },
  { name: 'Cacao đá xay', price: 30000, category: 'cacao', unit: 'ly' },
  { name: 'Cacao đá xay bạc hà', price: 33000, category: 'cacao', unit: 'ly' },
  { name: 'Cacao đá xay oreo', price: 33000, category: 'cacao', unit: 'ly' },
  { name: 'Cacao dừa', price: 33000, category: 'cacao', unit: 'ly' },

  // TEA
  { name: 'Hồng trà phúc bồn tử', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà việt quất', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà ổi', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà dâu', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà đào', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà xí muội tắc', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà dưa hấu', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà lựu', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà vải', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà nho', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà xoài', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà gừng', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Hồng trà tắc', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Trà sữa trân châu', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Trà sữa cà phê caramel', price: 33000, category: 'tea', unit: 'ly' },
  { name: 'Trà la hán hoa cúc', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Trà hoa đậu biếc', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Trà atiso', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Trà lipton chanh', price: 28000, category: 'tea', unit: 'ly' },
  { name: 'Trà lipton sữa trân châu', price: 30000, category: 'tea', unit: 'ly' },

  // SMOOTHIE
  { name: 'Sinh tố bơ', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố mít', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố xoài', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố dâu', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố đu đủ', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố chuối', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố dưa gang', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố mãng cầu', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố khoai môn', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố sapoche', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố dứa', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố phúc bồn tử', price: 30000, category: 'smoothie', unit: 'ly' },
  { name: 'Sinh tố việt quất', price: 30000, category: 'smoothie', unit: 'ly' },

  // JUICE
  { name: 'Nước ép ổi', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Nước ép cam', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Nước ép thơm', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Nước ép cà rốt', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Nước ép cà chua', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Cam sữa', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Nước ép dưa hấu', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Đá chanh', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Chanh muối', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Chanh dây', price: 30000, category: 'juice', unit: 'ly' },
  { name: 'Cam mật ong', price: 30000, category: 'juice', unit: 'ly' },

  // SODA
  { name: 'Soda bạc hà', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda chanh dây', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda chanh đường', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda dâu', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda đào', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda nho', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda phúc bồn tử', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda vải', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda việt quất', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda ổi', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda xoài', price: 30000, category: 'soda', unit: 'ly' },
  { name: 'Soda kiwi', price: 30000, category: 'soda', unit: 'ly' },

  // BEER
  { name: 'Beer Ruby', price: 20000, category: 'beer', unit: 'chai' },
  { name: 'Beer Heineken', price: 28000, category: 'beer', unit: 'chai' },
  { name: 'Beer Sài Gòn Xanh', price: 23000, category: 'beer', unit: 'chai' },
  { name: 'Beer Tiger', price: 25000, category: 'beer', unit: 'chai' },
  { name: 'Beer úp ngược trái cây', price: 40000, category: 'beer', unit: 'ly' },
  { name: 'Beer úp ngược rượu', price: 45000, category: 'beer', unit: 'ly' },

  // MOJITO
  { name: 'Mojito bạc hà', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito dâu', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito dưa gang', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito đào', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito nho', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito phúc bồn tử', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito vải', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito việt quất', price: 39000, category: 'mojito', unit: 'ly' },
  { name: 'Mojito xoài', price: 39000, category: 'mojito', unit: 'ly' },

  // YAOURT
  { name: 'Yaourt đá', price: 25000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt ổi', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt vải', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt dâu', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt đào', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt nho', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt thơm', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt cam tươi', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt việt quất', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt chanh dây', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt phúc bồn tử', price: 28000, category: 'yaourt', unit: 'ly' },
  { name: 'Yaourt trái cây dầm', price: 32000, category: 'yaourt', unit: 'ly' },
];

// GET ALL PRODUCTS
productRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách món',
      error: error.message,
    });
  }
});

// CREATE PRODUCT
productRouter.post('/', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const category = String(req.body?.category || 'other').trim();
    const price = Number(req.body?.price || 0);
    const unit = String(req.body?.unit || 'ly').trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tên món là bắt buộc',
      });
    }

    const existed = await Product.findOne({ name });
    if (existed) {
      return res.status(400).json({
        success: false,
        message: `Món "${name}" đã tồn tại`,
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      unit,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('POST /api/products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo món',
      error: error.message,
    });
  }
});

// UPDATE PRODUCT
productRouter.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món',
      });
    }

    const nextName = req.body?.name !== undefined ? String(req.body.name).trim() : product.name;
    const nextCategory =
      req.body?.category !== undefined ? String(req.body.category).trim() : product.category;
    const nextPrice =
      req.body?.price !== undefined ? Number(req.body.price || 0) : product.price;
    const nextUnit = req.body?.unit !== undefined ? String(req.body.unit).trim() : product.unit;
    const nextIsActive =
      req.body?.isActive !== undefined ? Boolean(req.body.isActive) : product.isActive;

    if (!nextName) {
      return res.status(400).json({
        success: false,
        message: 'Tên món không được để trống',
      });
    }

    if (nextName !== product.name) {
      const existed = await Product.findOne({
        name: nextName,
        _id: { $ne: product._id },
      });

      if (existed) {
        return res.status(400).json({
          success: false,
          message: `Món "${nextName}" đã tồn tại`,
        });
      }
    }

    product.name = nextName;
    product.category = nextCategory;
    product.price = nextPrice;
    product.unit = nextUnit;
    product.isActive = nextIsActive;

    await product.save();

    res.json(product);
  } catch (error) {
    console.error('PUT /api/products/:id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật món',
      error: error.message,
    });
  }
});

// SEED MENU
productRouter.post('/seed-menu', async (req, res) => {
  try {
    const existingProducts = await Product.find({}, { name: 1 });
    const existingNames = new Set(existingProducts.map((item) => item.name));

    const missingProducts = MENU_SEED_DATA.filter((item) => !existingNames.has(item.name));

    let insertedProducts = [];
    if (missingProducts.length > 0) {
      insertedProducts = await Product.insertMany(
        missingProducts.map((item) => ({
          ...item,
          isActive: true,
        }))
      );
    }

    const allProducts = await Product.find().sort({ category: 1, name: 1 });

    res.json({
      success: true,
      message:
        insertedProducts.length > 0
          ? `Đã thêm ${insertedProducts.length} món vào menu`
          : 'Menu đã tồn tại đầy đủ, không có món mới để thêm',
      insertedCount: insertedProducts.length,
      products: allProducts,
    });
  } catch (error) {
    console.error('POST /api/products/seed-menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi seed menu',
      error: error.message,
    });
  }
});

// RESET MENU
productRouter.post('/reset-menu', async (req, res) => {
  try {
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(
      MENU_SEED_DATA.map((item) => ({
        ...item,
        isActive: true,
      }))
    );

    res.json({
      success: true,
      message: `Đã reset menu với ${insertedProducts.length} món`,
      insertedCount: insertedProducts.length,
      products: insertedProducts,
    });
  } catch (error) {
    console.error('POST /api/products/reset-menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi reset menu',
      error: error.message,
    });
  }
});

export { productRouter };
export default productRouter;
