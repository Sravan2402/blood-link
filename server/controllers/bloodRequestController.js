const pool = require("../config/db.js");
const createBloodRequest = async (req, res) => {
  try {
    const {
      blood_group,
      units_required,
      patient_name,
      patient_age,
      patient_gender,
      city,
      hospital_address,
      urgency,
      required_before,
    } = req.body;
    const userId = req.user.user_id;
    const role = req.user.role;
    if (role !== "HOSPITAL") {
      return res.status(403).json({
        success: false,
        message: "only hospital can create blood request",
      });
    }
    if (
      !blood_group ||
      !units_required ||
      !patient_name ||
      !city ||
      !hospital_address ||
      !urgency
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }
    const hospital = await pool.query(
      "SELECT hospital_id FROM hospitals WHERE user_id = $1",
      [userId],
    );
    if (hospital.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }
    const hospitalId = hospital.rows[0].hospital_id;
    const newBloodRequest = await pool.query(
      `INSERT INTO blood_requests (hospital_id, blood_group, units_required, patient_name, patient_age, patient_gender, city, hospital_address, urgency, required_before)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        hospitalId,
        blood_group,
        units_required,
        patient_name,
        patient_age,
        patient_gender,
        city,
        hospital_address,
        urgency,
        required_before,
      ],
    );
    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      data: newBloodRequest.rows[0],
    });
  } catch (error) {
    console.error("Create Blood Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blood request",
      error: error.message,
    });
  }
};
const getMyBloodRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const role = req.user.role;

    console.log("User ID:", userId);
    console.log("Role:", role);

    if (role !== "HOSPITAL") {
      return res.status(403).json({
        success: false,
        message: "Only hospitals can access their blood requests",
      });
    }

    console.log("Finding hospital...");

    const hospital = await pool.query(
      `SELECT hospital_id
       FROM hospitals
       WHERE user_id = $1`,
      [userId],
    );

    console.log("Hospital result:", hospital.rows);

    if (hospital.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    const hospitalId = hospital.rows[0].hospital_id;

    console.log("Hospital ID:", hospitalId);

    console.log("Finding blood requests...");

    const result = await pool.query(
      `SELECT *
       FROM blood_requests
       WHERE hospital_id = $1
       ORDER BY created_at DESC`,
      [hospitalId],
    );

    console.log("Blood requests:", result.rows);

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get My Blood Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getOpenBloodRequests = async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== "DONOR") {
      return res.status(403).json({
        success: false,
        message: "Only donors can access open blood requests",
      });
    }
    const result = await pool.query(
      `SELECT
          request_id,
          hospital_id,
          blood_group,
          units_required,
          patient_name,
          patient_age,
          patient_gender,
          city,
          hospital_address,
          urgency,
          status,
          required_before,
          created_at
       FROM blood_requests
       WHERE status = 'OPEN'
       ORDER BY
         CASE
           WHEN urgency = 'CRITICAL' THEN 1
           WHEN urgency = 'HIGH' THEN 2
           WHEN urgency = 'MEDIUM' THEN 3
           WHEN urgency = 'LOW' THEN 4
         END,
         created_at DESC`,
    );
    return res.status(200).json({
      success: true,
      count: result.rowCount,
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get Open Blood Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getAllBloodRequests = async (req, res) => {};
const getBloodRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `select * from blood_requests where request_id = $1`,
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }
    return res.status(200).json({
      success: true,
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Get Blood Request by ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const respondToBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { response_message } = req.body;

    const userId = req.user.user_id;
    const role = req.user.role;
    console.log("User ID:", userId);
    // 1. Check role
    if (role !== "DONOR") {
      return res.status(403).json({
        success: false,
        message: "Only donors can respond to blood requests.",
      });
    }

    // 2. Get donor_id
    const donorResult = await pool.query(
      `SELECT donor_id
       FROM donors
       WHERE user_id = $1`,
      [userId],
    );

    if (donorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found.",
      });
    }

    const donorId = donorResult.rows[0].donor_id;

    // 3. Check request exists
    const requestResult = await pool.query(
      `SELECT *
       FROM blood_requests
       WHERE request_id = $1`,
      [requestId],
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found.",
      });
    }

    // 4. Check request status
    if (requestResult.rows[0].status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "This blood request is no longer open.",
      });
    }

    // 5. Check duplicate response
    const existingResponse = await pool.query(
      `SELECT response_id
       FROM blood_request_responses
       WHERE request_id = $1
       AND donor_id = $2`,
      [requestId, donorId],
    );

    if (existingResponse.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already responded to this request.",
      });
    }

    // 6. Insert response
    const responseResult = await pool.query(
      `INSERT INTO blood_request_responses
      (
        request_id,
        donor_id,
        response_message,
        status
      )
      VALUES ($1, $2, $3, 'PENDING')
      RETURNING *`,
      [requestId, donorId, response_message],
    );

    return res.status(201).json({
      success: true,
      message: "Response submitted successfully.",
      response: responseResult.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const updateBloodRequest = async (req, res) => {};
const deleteBloodRequest = async (req, res) => {};
module.exports = {
  getOpenBloodRequests,
  createBloodRequest,
  getAllBloodRequests,
  getMyBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
  respondToBloodRequest,
};
