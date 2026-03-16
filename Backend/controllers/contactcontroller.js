const Contact = require("../models/contact");

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const contact = new Contact({
      userId: req.userId,
      name,
      email,
      phone,
      address
    });
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CONTACTS
exports.getContacts = async (req, res) => {
  try {

    const search = req.query.search;

    let query = { userId: req.userId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const contacts = await Contact.find(query);

    res.json(contacts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CONTACT
exports.updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CONTACT
exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};