const CRMContact = require("../models/CRMContact");
const CRMInteraction = require("../models/CRMInteraction");

// ==================== CONTACT OPERATIONS ====================

async function getAllContacts(query = {}) {
  const { status, source, page = 1, limit = 20 } = query;
  
  const filter = { isActive: true };
  if (status) filter.status = status;
  if (source) filter.source = source;

  const contacts = await CRMContact.find(filter)
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await CRMContact.countDocuments(filter);

  return {
    contacts,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
}

async function getContactById(id) {
  return await CRMContact.findById(id).populate("assignedTo", "name email");
}

async function createContact(data) {
  const contact = new CRMContact(data);
  return await contact.save();
}

async function updateContact(id, data) {
  return await CRMContact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

async function deleteContact(id) {
  return await CRMContact.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
}

async function searchContacts(searchTerm) {
  const regex = new RegExp(searchTerm, "i");
  return await CRMContact.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex },
        ],
      },
    ],
  }).populate("assignedTo", "name email");
}

// ==================== INTERACTION OPERATIONS ====================

async function getAllInteractions(contactId, query = {}) {
  const { type, page = 1, limit = 20 } = query;
  
  const filter = {};
  if (contactId) filter.contact = contactId;
  if (type) filter.type = type;

  const interactions = await CRMInteraction.find(filter)
    .populate("contact", "name email phone")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await CRMInteraction.countDocuments(filter);

  return {
    interactions,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
}

async function getInteractionById(id) {
  return await CRMInteraction.findById(id)
    .populate("contact", "name email phone")
    .populate("createdBy", "name email");
}

async function createInteraction(data) {
  const interaction = new CRMInteraction(data);
  const saved = await interaction.save();
  
  // Populate the saved interaction
  return await CRMInteraction.findById(saved._id)
    .populate("contact", "name email phone")
    .populate("createdBy", "name email");
}

async function updateInteraction(id, data) {
  return await CRMInteraction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("contact", "name email phone").populate("createdBy", "name email");
}

async function deleteInteraction(id) {
  return await CRMInteraction.findByIdAndDelete(id);
}

// ==================== DASHBOARD/ANALYTICS ====================

async function getDashboardStats() {
  const [
    totalContacts,
    newContacts,
    contactedContacts,
    interestedContacts,
    convertedContacts,
    totalInteractions,
    recentInteractions,
  ] = await Promise.all([
    CRMContact.countDocuments({ isActive: true }),
    CRMContact.countDocuments({ isActive: true, status: "new" }),
    CRMContact.countDocuments({ isActive: true, status: "contacted" }),
    CRMContact.countDocuments({ isActive: true, status: "interested" }),
    CRMContact.countDocuments({ isActive: true, status: "converted" }),
    CRMInteraction.countDocuments(),
    CRMInteraction.find()
      .populate("contact", "name")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return {
    totalContacts,
    newContacts,
    contactedContacts,
    interestedContacts,
    convertedContacts,
    totalInteractions,
    recentInteractions,
  };
}

async function getContactsBySource() {
  return await CRMContact.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$source", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

async function getContactsByStatus() {
  return await CRMContact.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

// ==================== EXPORT ====================

module.exports = {
  // Contact operations
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  
  // Interaction operations
  getAllInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  
  // Dashboard/Analytics
  getDashboardStats,
  getContactsBySource,
  getContactsByStatus,
};
