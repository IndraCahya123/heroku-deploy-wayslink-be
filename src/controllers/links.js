const { Brand, Link } = require("../../models");

//catch error message
// console.log(error);
// res.status(500).send({
//     status: "Server Error",
//     message: "Sorry, there's error in our server"
// })

exports.addBrand = async (req, res) => {
    try {
        const { id } = req.userId;
    
        await Brand.create({
                title: req.body.title,
                description: req.body.description,
                image: req.files.image[0].filename,
                uniqueLink: req.body.unique,
                viewCount: 0,
                templateId: req.body.templateId,
                userId: id,
        });
        
        res.send({
            status: "success",
            message: "success add brand"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server",
            error: error
        });
    }
}

exports.addLinks = async (req, res) => {
    try {
        const links = await Link.create({
            uniqueLink: req.body.uniqueKeyLink,
            title: req.body.title,
            url: req.body.url,
            image: req.files.image[0].filename
        });

        res.send({
            status: "success",
            message: "success add links",
            data: {
                links
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server",
            error
        });
    }
}

exports.addBlankLink = async (req, res) => {
    try {
        await Link.create({
            uniqueLink: req.body.uniqueLink,
            title: "",
            url: "",
            image: null
        });

        res.send({
            status: "success",
            message: "success add link"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        });
    }
}

exports.updateLink = async (req, res) => {
    try {
        const {linkId} = req.params;

        const getLink = await Link.findOne({
            where: {
                id: linkId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt",`uniqueLink`, `BrandId`]
            }
        });

        let newImage;

        if (req.files.image === undefined) {
            newImage = getLink.image;
        } else {
            newImage = req.files.image[0].filename;
        }

        const linkUpdate = {
            ...req.body,
            image: newImage
        }

        // update link
        await Link.update(linkUpdate, {
            where: {
                id: linkId
            }
        });

        res.send({
            status: "success",
            message: "success update your link",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        })
    }
}

exports.deletelink = async (req, res) => {
    try {
        const { linkId } = req.params;

        const getLink = await Link.findOne({
            where: {
                id: linkId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt",`uniqueLink`, `BrandId`]
            }
        });

        await Link.destroy({
            where: {
                id: linkId
            }
        });

        res.send({
            status: "success",
            message: "success delete your link"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        })
    }
}

exports.getMyLinks = async (req, res) => {
    try {
        const { id } = req.userId;

        //search all links by logged user id
        const brands = await Brand.findAll({
            where: {
                userId: id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "UserId"]
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        let links = [];

        for (let i = 0; i < brands.length; i++) {
            const allLinks = await Link.findAll({
                where: {
                    uniqueLink: brands[i].uniqueLink
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt",`uniqueLink`, `BrandId`]
                }
            });

            const modifiedImg = allLinks.map(link => {
                return {
                    ...link.dataValues,
                    image: process.env.IMG_URL + link.image
                }
            })

            const myLinks = {
                ...brands[i].dataValues,
                image: process.env.IMG_URL + brands[i].image,
                links: modifiedImg
            }

            links.push(myLinks);
        }

        res.send({
            status: "success",
            message: "success to get your links",
            data: {
                links
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        });
    }
}

exports.getBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const userId = req.userId.id;

        const selectedBrand = await Brand.findOne({
            where: {
                id: brandId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "UserId"]
            }
        });

        //if brand doesn't exist
        if (!selectedBrand)
            return res.status(404).send({
                status: "Not found",
                message: `Brand with id ${brandId} doesn't exists`
            });
        
        //check if the user has authorize to delete this brand
        if (selectedBrand.userId != userId)
            return res.status(401).send({
                status: "Forbidden",
                message: "You don't have authorization to edit this brand"
            });
        
        const allLinks = await Link.findAll({
            where: {
                uniqueLink: selectedBrand.uniqueLink
            },
            attributes: {
                exclude: ["createdAt", "updatedAt",`uniqueLink`, `BrandId`]
            }
        });

        const modifiedImg = allLinks.map(link => {
            return {
                ...link.dataValues,
                image: process.env.IMG_URL + link.image
            }
        })

        const myLinks = {
            ...selectedBrand.dataValues,
            image: process.env.IMG_URL + selectedBrand.image,
            links: modifiedImg
        };

        res.send({
            status: "success",
            message: "Success to get Brand data",
            data: {
                link: myLinks
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        });
    }
}

exports.deleteBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const userId = req.userId.id;
    
        //search brand
        const selectedBrand = await Brand.findOne({
            where: {
                id: brandId
            }
        });
    
        //if brand doesn't exist
        if (!selectedBrand)
            return res.status(404).send({
                status: "Not found",
                message: `Brand with id ${brandId} doesn't exists`
            });
        
        //check if the user has authorize to delete this brand
        if (selectedBrand.userId != userId)
            return res.status(401).send({
                status: "Forbidden",
                message: "You don't have authorization to delete this brand"
            })
        
        await Brand.destroy({
            where: {
                id: brandId
            }
        });
        
        res.send({
            status: "success",
            message: "Brand have been Deleted",
            data: brandId
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        });
    }    
}

exports.previewLink = async (req, res) => {
    try {
        const { uniqueLink } = req.params;
        const { templateId } = req.params;
        const userId = req.userId.id;
    
        //search brand
        const selectedBrand = await Brand.findOne({
            where: {
                uniqueLink
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "UserId"]
            }
        });
    
        //if brand doesn't exist
        if (!selectedBrand)
            return res.status(404).send({
                status: "Not found",
                message: `Brand with id ${brandId} doesn't exists`
            });
        
        //check the brand template
        if (selectedBrand.templateId != templateId)
        return res.status(404).send({
            status: "Not found",
            message: `Brand with templateId ${templateId} doesn't exists`
        });
        
        //check if the user has authorize to delete this brand
        if (selectedBrand.userId != userId)
            return res.status(401).send({
                status: "Forbidden",
                message: "You don't have authorization to look this brand"
            })

        const allLinks = await Link.findAll({
            where: {
                uniqueLink: selectedBrand.uniqueLink
            },
            attributes: {
                exclude: ["createdAt", "updatedAt",`uniqueLink`, `BrandId`]
            }
        });

        const modifiedImg = allLinks.map(link => {
            return {
                ...link.dataValues,
                image: process.env.IMG_URL + link.image
            }
        })

        const myLinks = {
            ...selectedBrand.dataValues,
            image: process.env.IMG_URL + selectedBrand.image,
            links: modifiedImg
        }

        res.send({
            status: "success",
            message: "Success to get Brand data",
            data: {
                link: myLinks
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        })
    }
}

exports.updateBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const userId = req.userId.id;

        const selectedBrand = await Brand.findOne({
            where: {
                id: brandId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "UserId"]
            }
        });

        //if brand doesn't exist
        if (!selectedBrand)
            return res.status(404).send({
                status: "Not found",
                message: `Brand with id ${brandId} doesn't exists`
            });
        
        //check if the user has authorize to delete this brand
        if (selectedBrand.userId != userId)
            return res.status(401).send({
                status: "Forbidden",
                message: "You don't have authorization to edit this brand"
            })
        
        let newImage;

        if (req.files.image === undefined) {
            newImage = selectedBrand.image;
        } else {
            newImage = req.files.image[0].filename;
        }

        const brandUpdate = {
            ...req.body,
            image: newImage
        }

        await Brand.update(brandUpdate, {
            where: {
                id: brandId
            }
        });

        const updatedBrand = await Brand.findOne({
            where: {
                id: brandId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "UserId"]
            }
        });

        const allLinks = await Link.findAll({
            where: {
                uniqueLink: updatedBrand.uniqueLink
            },
            attributes: {
                exclude: ["createdAt", "updatedAt",`uniqueLink`, `BrandId`]
            }
        });

        const modifiedImg = allLinks.map(link => {
            return {
                ...link.dataValues,
                image: process.env.IMG_URL + link.image
            }
        })

        const myLinks = {
            ...updatedBrand.dataValues,
            image: process.env.IMG_URL + updatedBrand.image,
            links: modifiedImg
        }

        res.send({
            status: "success",
            message: "Success to update Brand data",
            data: {
                link: myLinks
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        })
    }
}

exports.addView = async (req, res) => {
    try {
        const { brandId } = req.params;
        const userId = req.userId.id;

        const selectedBrand = await Brand.findOne({
            where: {
                id: brandId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "UserId"]
            }
        });

        //if brand doesn't exist
        if (!selectedBrand)
            return res.status(404).send({
                status: "Not found",
                message: `Brand with id ${brandId} doesn't exists`
            });
        
        //check if the user has authorize to delete this brand
        if (selectedBrand.userId != userId)
            return res.status(401).send({
                status: "Forbidden",
                message: "You don't have authorization to edit this brand"
            })
        
        const viewUpdate = await Brand.update(req.body, {
            where: {
                id: brandId
            }
        })
        console.log(viewUpdate);
        res.send({
            status: "success",
            message: "View added",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Server Error",
            message: "Sorry, there's error in our server"
        })
    }
}