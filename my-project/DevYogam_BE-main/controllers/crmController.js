const crmService = require("../services/crmService");

// ==================== CONTACT CONTROLLERS ====================

async function getContacts(req, res) {
  try {
    const result = await crmService.getAllContacts(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getContact(req, res) {
  try {
    const contact = await crmService.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createContact(req, res) {
  try {
    const contact = await crmService.createContact(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateContact(req, res) {
  try {
    const contact = await crmService.updateContact(req.params.id, req.body);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteContact(req, res) {
  try {
    const contact = await crmService.deleteContact(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function searchContacts(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search term is required" });
    }
    const contacts = await crmService.searchContacts(q);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ==================== INTERACTION CONTROLLERS ====================

async function getInteractions(req, res) {
  try {
    const { contactId } = req.params;
    const result = await crmService.getAllInteractions(contactId, req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getInteraction(req, res) {
  try {
    const interaction = await crmService.getInteractionById(req.params.id);
    if (!interaction) {
      return res.status(404).json({ error: "Interaction not found" });
    }
    res.json(interaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createInteraction(req, res) {
  try {
    // Add createdBy from authenticated user
    if (req.user) {
      req.body.createdBy = req.user.id;
    }
    const interaction = await crmService.createInteraction(req.body);
    res.status(201).json(interaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateInteraction(req, res) {
  try {
    const interaction = await crmService.updateInteraction(req.params.id, req.body);
    if (!interaction) {
      return res.status(404).json({ error: "Interaction not found" });
    }
    res.json(interaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteInteraction(req, res) {
  try {
    const interaction = await crmService.deleteInteraction(req.params.id);
    if (!interaction) {
      return res.status(404).json({ error: "Interaction not found" });
    }
    res.json({ message: "Interaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ==================== DASHBOARD CONTROLLERS ====================

async function getDashboardStats(req, res) {
  try {
    const stats = await crmService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getContactsBySource(req, res) {
  try {
    const data = await crmService.getContactsBySource();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getContactsByStatus(req, res) {
  try {
    const data = await crmService.getContactsByStatus();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  // Contact controllers
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  
  // Interaction controllers
  getInteractions,
  getInteraction,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  
  // Dashboard controllers
  getDashboardStats,
  getContactsBySource,
  getContactsByStatus,
};
