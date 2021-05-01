//digunakan untuk memisahkan route dengan file bundle (server.js)
const express = require("express");

const router = express.Router();

const { authentication } = require("../middlewares/Auth");
const { uploadImageFile } = require("../middlewares/uploadImage");

//auth route
const {
    userLogin,
    userRegister,
    checkAuth
} = require("../controllers/auth");

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/is-auth", authentication, checkAuth);

//user route
const {
    getUserById,
    editUser,
    deleteUser
} = require("../controllers/users");

router.get("/user", getUserById);
router.patch("/user", authentication, editUser);
router.delete("/user", authentication, deleteUser);

//link route

const {
    addLinks,
    addBlankLink,
    updateLink,
    deletelink,
    addBrand,
    getBrand,
    getMyLinks,
    deleteBrand,
    previewLink,
    updateBrand,
    addView
} = require("../controllers/links");

//child link
router.post("/links", authentication, uploadImageFile("image", false), addLinks);
router.patch("/link/:linkId", authentication, uploadImageFile("image", true), updateLink);
router.delete("/link/:linkId", authentication, deletelink);
router.post("/link", authentication, uploadImageFile("image", true), addBlankLink);
//parent link
router.post("/brand", authentication, uploadImageFile("image", false), addBrand);
router.get("/my-links", authentication, getMyLinks);
router.get("/brand/:brandId", authentication, getBrand);
router.delete("/brand/:brandId", authentication, deleteBrand);
router.get("/brand/:templateId/:uniqueLink", authentication, previewLink);
router.patch("/brand/:brandId", authentication, uploadImageFile("image", true), updateBrand);
router.patch("/brandView/:brandId", authentication, addView);

module.exports = router;