const authRoute = require("./AuthRoute");
const productRoute = require("./ProductRoute");
const blogRoute = require("./BlogRoute");
const pcategoryRoute = require("./ProdCategoryRoute");
const bcategoryRoute = require("./BlogCategoryRoute");
const brandRoute = require("./BrandRoute");
const couponRoute = require("./CouponRoute");
const colorRoute = require("./ColorRoute");
const enquiryRoute = require("./EnquiryRoute");

const routes = (app) => {
    app.use("/api/users", authRoute);
    app.use("/api/products", productRoute);
    app.use("/api/blogs", blogRoute);
    app.use("/api/categories", pcategoryRoute);
    app.use("/api/blogcategories", bcategoryRoute);
    app.use("/api/brands", brandRoute);
    app.use("/api/coupons", couponRoute);
    app.use("/api/colors", colorRoute);
    app.use("/api/enqs", enquiryRoute);
};

module.exports = routes;
