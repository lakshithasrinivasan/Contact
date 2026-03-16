const Contact = require("../models/contact");

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
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

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
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
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CONTACT
exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};