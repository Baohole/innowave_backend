const productsRoutes = require("./products.routes");
const reviewsRoutes = require("./reviews.routes");
const authRoutes = require("./auth.routes"); // 
const passwordRoutes = require('./password.routes')
// 

// const sysConfig = require('../../config/system');
// const auth = require('../../middleware/admin/auth.middleware');

module.exports = (app) => {
    app.use("/api/products", productsRoutes);
    app.use("/api/reviews", reviewsRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/password", passwordRoutes);
}

