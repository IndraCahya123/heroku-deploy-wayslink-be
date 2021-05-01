const { User } = require("../../models");

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.userId
        
        const user = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            }
        });

        const userModified = {
            ...user.dataValues,
        }

        res.send({
            status: "success",
            message: "Success to Get User",
            data: {
                user: userModified
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Error",
            message: "Server Error",
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.userId;

        const userSelected = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        });

        //check if user exist
        if (!userSelected) 
            return res.status(404).send({
                status: "Error",
                message: "User doesn't exist",
            });
            
        //check user
        if (userSelected && userSelected.id !== req.userId.id)
            return res.status(403).send({
                status: "Error",
                message: "You haven't authorization for edit this user"
            });
    
        await User.destroy({
            where: {
                id,
            },
        });
    
        res.send({
            status: "success",
            message: "Success Delete User",
            data: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.editUser = async (req, res) => {
    try {
        const { id } = req.userId;

        //search user
        const userSelected = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: [ "password", "createdAt", "updatedAt"]
            }
        });

        //check if user exist
        if (!userSelected) 
            return res.status(404).send({
                status: "Error",
                message: "User doesn't exist",
            });
            
        //check user
        if (userSelected && userSelected.id !== req.userId.id)
            return res.status(402).send({
                status: "Error",
                message: "You haven't authorization for edit this user"
            });

        const userUpdated = {
            ...req.body,
        }

        await User.update(userUpdated, {
            where: {
                id
            }
        });

        const userDataUpdated = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: [ "password", "createdAt", "updatedAt"]
            }
        });

        res.send({
            status: "success",
            message: "Update Success",
            data: {
                user : userDataUpdated
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}