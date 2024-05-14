const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup", async (req, res) => {
    // here only we are verifying the body using success
    const { success } = signupBody.safeParse(req.body);

    // if success is false -
    if (!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    // find if user already exists
    const existingUser = await User.findOne({
        username: req.body.username
    });

    // return it already exists
    if (existingUser) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const userId = user._id;

    const token = jwt.sign({
        user
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const {success} = signinBody.safeParse(req.body);
    if(!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        res.json({
            token: token
        })
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})

module.exports = router;