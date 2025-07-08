const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, description } = req.body;
    const transaction = new Transaction({
      userId: req.user.userId, // from auth middleware
      type,
      category,
      amount,
      date,
      description,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ msg: "Error adding transaction", error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching transactions", error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deleted) return res.status(404).json({ msg: "Transaction not found" });
    res.json({ msg: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting transaction", error: err.message });
  }
};
