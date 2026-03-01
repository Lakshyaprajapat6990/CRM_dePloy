const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/crm/contacts:
 *   get:
 *     summary: Get all CRM contacts
 *     tags: [CRM - Contacts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, contacted, interested, not_interested, converted, lost]
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get('/contacts', protect, adminOnly, crmController.getContacts);

/**
 * @swagger
 * /api/crm/contacts/search:
 *   get:
 *     summary: Search contacts
 *     tags: [CRM - Contacts]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/contacts/search', protect, adminOnly, crmController.searchContacts);

/**
 * @swagger
 * /api/crm/contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags: [CRM - Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact data
 *       404:
 *         description: Contact not found
 */
router.get('/contacts/:id', protect, adminOnly, crmController.getContact);

/**
 * @swagger
 * /api/crm/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [CRM - Contacts]
 *     requestBody:
 *       description: Contact data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               alternatePhone:
 *                 type: string
 *               source:
 *                 type: string
 *                 enum: [website, phone, referral, social_media, advertisement, other]
 *               status:
 *                 type: string
 *                 enum: [new, contacted, interested, not_interested, converted, lost]
 *               interestedIn:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created
 *       400:
 *         description: Invalid input
 */
router.post('/contacts', protect, adminOnly, crmController.createContact);

/**
 * @swagger
 * /api/crm/contacts/{id}:
 *   put:
 *     summary: Update contact by ID
 *     tags: [CRM - Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Contact data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated
 *       404:
 *         description: Contact not found
 */
router.put('/contacts/:id', protect, adminOnly, crmController.updateContact);

/**
 * @swagger
 * /api/crm/contacts/{id}:
 *   delete:
 *     summary: Delete contact by ID (soft delete)
 *     tags: [CRM - Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted
 *       404:
 *         description: Contact not found
 */
router.delete('/contacts/:id', protect, adminOnly, crmController.deleteContact);

/**
 * @swagger
 * /api/crm/interactions:
 *   get:
 *     summary: Get all interactions
 *     tags: [CRM - Interactions]
 *     parameters:
 *       - in: query
 *         name: contactId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of interactions
 */
router.get('/interactions', protect, adminOnly, crmController.getInteractions);

/**
 * @swagger
 * /api/crm/interactions/{id}:
 *   get:
 *     summary: Get interaction by ID
 *     tags: [CRM - Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interaction data
 *       404:
 *         description: Interaction not found
 */
router.get('/interactions/:id', protect, adminOnly, crmController.getInteraction);

/**
 * @swagger
 * /api/crm/interactions:
 *   post:
 *     summary: Create a new interaction
 *     tags: [CRM - Interactions]
 *     requestBody:
 *       description: Interaction data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contact
 *               - type
 *               - direction
 *               - subject
 *             properties:
 *               contact:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [call, email, sms, meeting, note, payment, booking, other]
 *               direction:
 *                 type: string
 *                 enum: [inbound, outbound]
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               outcome:
 *                 type: string
 *                 enum: [successful, no_response, scheduled, failed, pending]
 *     responses:
 *       201:
 *         description: Interaction created
 *       400:
 *         description: Invalid input
 */
router.post('/interactions', protect, adminOnly, crmController.createInteraction);

/**
 * @swagger
 * /api/crm/interactions/{id}:
 *   put:
 *     summary: Update interaction by ID
 *     tags: [CRM - Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Interaction data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               outcome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interaction updated
 *       404:
 *         description: Interaction not found
 */
router.put('/interactions/:id', protect, adminOnly, crmController.updateInteraction);

/**
 * @swagger
 * /api/crm/interactions/{id}:
 *   delete:
 *     summary: Delete interaction by ID
 *     tags: [CRM - Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Interaction deleted
 *       404:
 *         description: Interaction not found
 */
router.delete('/interactions/:id', protect, adminOnly, crmController.deleteInteraction);

/**
 * @swagger
 * /api/crm/dashboard/stats:
 *   get:
 *     summary: Get CRM dashboard statistics
 *     tags: [CRM - Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard/stats', protect, adminOnly, crmController.getDashboardStats);

/**
 * @swagger
 * /api/crm/dashboard/by-source:
 *   get:
 *     summary: Get contacts grouped by source
 *     tags: [CRM - Dashboard]
 *     responses:
 *       200:
 *         description: Contacts by source
 */
router.get('/dashboard/by-source', protect, adminOnly, crmController.getContactsBySource);

/**
 * @swagger
 * /api/crm/dashboard/by-status:
 *   get:
 *     summary: Get contacts grouped by status
 *     tags: [CRM - Dashboard]
 *     responses:
 *       200:
 *         description: Contacts by status
 */
router.get('/dashboard/by-status', protect, adminOnly, crmController.getContactsByStatus);

module.exports = router;
