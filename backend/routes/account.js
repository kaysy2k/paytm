const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { amount, to } = req.body;

        // Find the sender account
        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        // if balance is less than the amount
        if (account.balance < amount) {
            (await session).abortTransaction();
            return res.status(400).json({
                message: "Insufficient Balance"
            })
        }

        // Find the receiver account
        const toAccount = await Account.findOne({
            userId: to
        }).session(session);

        // if the receiver account doesnt exist
        if (!toAccount) {
            (await session).abortTransaction();
            return res.status(400).json({
                message: "Invalid Account"
            })
        }

        //Perform the transfer
        await Account.updateOne({
            userId: req.userId
        }, {
            $inc: {
                balance: -amount
            }
        }).session(session);

        await Account.updateOne({
            userId: to
        }, {
            $inc: {
                balance: amount
            }
        }).session(session);

        // Commit the transaction
        (await session).commitTransaction();

        res.json({
            message: "Transfer Successful"
        });

    }
    catch (error) {
        console.error(error);
        await session.abortTransaction();
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }

});

module.exports = router;