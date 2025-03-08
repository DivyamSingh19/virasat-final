const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Helper: Determine the dynamic table name based on the user type and id.
 * For example: 
 *   - alumni with id "abc123" gets table "experience_alumni_abc123"
 *   - student with id "xyz789" gets table "experience_student_xyz789"
 */
function getTableName(userType, userId) {
  if (userType === 'alumni') {
    return `experience_alumni_${userId}`;
  } else if (userType === 'student') {
    return `experience_student_${userId}`;
  } else {
    throw new Error("Invalid userType. Must be 'alumni' or 'student'.");
  }
}

/**
 * Helper: Ensure that the dynamic table for the given user exists.
 * The table will have three columns: company_name, role, and period.
 */
async function ensureTableExists(userType, userId) {
  const tableName = getTableName(userType, userId);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id SERIAL PRIMARY KEY,
      company_name TEXT,
      role TEXT,
      period TEXT
    )
  `;
  await prisma.$executeRawUnsafe(createTableQuery);
}

/**
 * Create a new experience record in the dynamic table.
 * Expects in req.body:
 *   - userType (string: 'alumni' or 'student')
 *   - userId (string)
 *   - company_name (string)
 *   - role (string)
 *   - period (string)
 */
const createExperience = async (req, res) => {
  try {
    const { userType, userId, company_name, role, period } = req.body;
    if (!userType || !userId || !company_name || !role || !period) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userType, userId, company_name, role and period are all required."
      });
    }

    // Ensure the dynamic experience table exists
    await ensureTableExists(userType, userId);
    const tableName = getTableName(userType, userId);

    // Insert the new record (using RETURNING * to get the inserted row back)
    const insertQuery = `
      INSERT INTO "${tableName}" (company_name, role, period)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const inserted = await prisma.$queryRawUnsafe(insertQuery, company_name, role, period);
    return res.status(201).json({ success: true, experience: inserted });
  } catch (error) {
    console.error("Error creating experience:", error);
    return res.status(500).json({ success: false, message: "Error creating experience." });
  }
};

/**
 * Retrieve all experience records from the dynamic table.
 * Expects in req.query:
 *   - userType (string: 'alumni' or 'student')
 *   - userId (string)
 */
const getExperiences = async (req, res) => {
  try {
    const { userType, userId } = req.query;
    if (!userType || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameters: userType and userId."
      });
    }
    await ensureTableExists(userType, userId);
    const tableName = getTableName(userType, userId);
    const selectQuery = `SELECT * FROM "${tableName}" ORDER BY id ASC`;
    const experiences = await prisma.$queryRawUnsafe(selectQuery);
    return res.status(200).json({ success: true, experiences });
  } catch (error) {
    console.error("Error retrieving experiences:", error);
    return res.status(500).json({ success: false, message: "Error retrieving experiences." });
  }
};

/**
 * Update an experience record.
 * Expects:
 *   - Query parameters: userType and userId
 *   - Request body: id (of the experience row to update), plus company_name, role, period.
 */
const updateExperience = async (req, res) => {
  try {
    const { userType, userId } = req.query;
    const { id, company_name, role, period } = req.body;
    if (!userType || !userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: userType, userId and experience record id."
      });
    }
    await ensureTableExists(userType, userId);
    const tableName = getTableName(userType, userId);
    const updateQuery = `
      UPDATE "${tableName}"
      SET company_name = $1, role = $2, period = $3
      WHERE id = $4
      RETURNING *
    `;
    const updatedRecord = await prisma.$queryRawUnsafe(updateQuery, company_name, role, period, id);
    return res.status(200).json({ success: true, experience: updatedRecord });
  } catch (error) {
    console.error("Error updating experience:", error);
    return res.status(500).json({ success: false, message: "Error updating experience." });
  }
};

/**
 * Delete an experience record.
 * Expects in req.query:
 *   - userType (string)
 *   - userId (string)
 *   - id (the record id to be deleted)
 */
const deleteExperience = async (req, res) => {
  try {
    const { userType, userId, id } = req.query;
    if (!userType || !userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameters: userType, userId, or record id."
      });
    }
    await ensureTableExists(userType, userId);
    const tableName = getTableName(userType, userId);
    const deleteQuery = `
      DELETE FROM "${tableName}" 
      WHERE id = $1 
      RETURNING *
    `;
    const deletedRecord = await prisma.$queryRawUnsafe(deleteQuery, id);
    return res.status(200).json({ success: true, experience: deletedRecord });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return res.status(500).json({ success: false, message: "Error deleting experience." });
  }
};

export {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
};