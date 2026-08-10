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
      VALUES ($1, $2, $3, 'ACCEPTED_BY_DONOR')
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
const getBloodRequestResponses = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.user_id;
    const role = req.user.role;
    if (role !== "HOSPITAL") {
      return res.status(403).json({
        success: false,
        message: "Only hospitals can view responses to their blood requests.",
      });
    }
    const hospitalResult = await pool.query(
      `select hospital_id from hospitals where user_id =$1`,
      [userId],
    );
    if (hospitalResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }
    const hospitalId = hospitalResult.rows[0].hospital_id;
    const requestResult = await pool.query(
      `select request_id from blood_requests where request_id=$1 and hospital_id=$2`,
      [requestId, hospitalId],
    );
    if (requestResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found or does not belong to this hospital.",
      });
    }
    const responsesResult = await pool.query(
      `SELECT r.response_id,u.full_name,d.blood_group,u.email,u.phone,r.response_message,r.status,r.responded_at FROM blood_request_responses r
      JOIN donors d
      ON r.donor_id = d.donor_id
      JOIN users u
      ON d.user_id = u.user_id
      WHERE r.request_id = $1
      ORDER BY r.responded_at DESC;`,
      [requestId],
    );
    return res.status(200).json({
      success: true,
      message: "Blood request responses fetched successfully.",
      count: responsesResult.rowCount,
      responses: responsesResult.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const bloodAccepted = async (req, res) => {
  const client = await pool.connect();

  try {
    const { responseId } = req.params;
    const userId = req.user.user_id;
    const role = req.user.role;

    // 1. Check role
    if (role !== "HOSPITAL") {
      return res.status(403).json({
        success: false,
        message: "Only hospitals can accept blood requests.",
      });
    }

    // 2. Get hospital_id
    const hospitalResult = await client.query(
      `SELECT hospital_id
       FROM hospitals
       WHERE user_id = $1`,
      [userId],
    );

    if (hospitalResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }

    const hospitalId = hospitalResult.rows[0].hospital_id;

    // 3. Get response details
    const responseResult = await client.query(
      `SELECT *
       FROM blood_request_responses
       WHERE response_id = $1`,
      [responseId],
    );

    if (responseResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Response not found.",
      });
    }

    const response = responseResult.rows[0];

    // 4. Check if already accepted
    if (response.status !== "ACCEPTED_BY_DONOR") {
      return res.status(400).json({
        success: false,
        message: "Donor has not accepted this request.",
      });
    }

    // 5. Verify the request belongs to this hospital
    const requestResult = await client.query(
      `SELECT request_id, status
   FROM blood_requests
   WHERE request_id = $1
   AND hospital_id = $2`,
      [response.request_id, hospitalId],
    );

    if (requestResult.rowCount === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this donor.",
      });
    }
    const request = requestResult.rows[0];
    await client.query("BEGIN");

    if (request.status !== "OPEN") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Blood request is already matched or closed.",
      });
    }
    // ==========================
    // Start Transaction
    // ==========================

    // 6. Accept selected donor
    // Get selected donor details
    // 6. Select donor
    await client.query(
      `UPDATE blood_request_responses
   SET status = 'SELECTED_BY_HOSPITAL'
   WHERE response_id = $1`,
      [responseId],
    );

    // 7. Reject other donors
    await client.query(
      `UPDATE blood_request_responses
   SET status = 'REJECTED_BY_HOSPITAL'
   WHERE request_id = $1
   AND response_id <> $2
   AND status = 'ACCEPTED_BY_DONOR'`,
      [response.request_id, responseId],
    );

    // 8. Update blood request
    await client.query(
      `UPDATE blood_requests
   SET status = 'MATCHED'
   WHERE request_id = $1`,
      [response.request_id],
    );

    // 9. Get selected donor details
    const donorDetails = await client.query(
      `SELECT
      r.response_id,
      r.status,
      r.responded_at,
      u.full_name,
      u.phone,
      u.email,
      d.blood_group
   FROM blood_request_responses r
   JOIN donors d
     ON r.donor_id = d.donor_id
   JOIN users u
     ON d.user_id = u.user_id
   WHERE r.response_id = $1`,
      [responseId],
    );

    // 10. Commit
    await client.query("COMMIT");

    // 11. Return response
    return res.status(200).json({
      success: true,
      message: "Donor selected successfully.",
      data: donorDetails.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  } finally {
    client.release();
  }
};
const completeBloodRequest = async (req, res) => {
  const client = await pool.connect();

  try {
    const { requestId } = req.params;
    const userId = req.user.user_id;
    const role = req.user.role;

    // 1. Check role
    if (role !== "HOSPITAL") {
      return res.status(403).json({
        success: false,
        message: "Only hospitals can complete blood requests.",
      });
    }

    await client.query("BEGIN");

    // 2. Get hospital_id
    const hospitalResult = await client.query(
      `SELECT hospital_id
       FROM hospitals
       WHERE user_id = $1`,
      [userId],
    );

    if (hospitalResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Hospital not found.",
      });
    }

    const hospitalId = hospitalResult.rows[0].hospital_id;

    // 3. Get request details
    const requestResult = await client.query(
      `SELECT
          request_id,
          hospital_id,
          blood_group,
          units_required,
          status
       FROM blood_requests
       WHERE request_id = $1
       AND hospital_id = $2`,
      [requestId, hospitalId],
    );

    if (requestResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Blood request not found or does not belong to this hospital.",
      });
    }

    const request = requestResult.rows[0];

    // 4. Request must be MATCHED
    if (request.status !== "MATCHED") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Only matched blood requests can be completed.",
      });
    }

    // 5. Get selected donor
    const donorResult = await client.query(
      `SELECT donor_id
       FROM blood_request_responses
       WHERE request_id = $1
       AND status = 'SELECTED_BY_HOSPITAL'`,
      [requestId],
    );

    if (donorResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "No donor has been selected for this request.",
      });
    }

    const donorId = donorResult.rows[0].donor_id;

    // 6. Update blood request
    const completedRequest = await client.query(
      `UPDATE blood_requests
       SET status = 'COMPLETED'
       WHERE request_id = $1
       RETURNING *`,
      [requestId],
    );

    // 7. Insert donation history
    const donationResult = await client.query(
      `INSERT INTO donation_history
       (
         request_id,
         donor_id,
         hospital_id,
         blood_group,
         units_donated
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        requestId,
        donorId,
        hospitalId,
        request.blood_group,
        request.units_required,
      ],
    );

    // 8. Commit
    await client.query("COMMIT");

    // 9. Response
    return res.status(200).json({
      success: true,
      message: "Blood request completed successfully.",
      data: {
        request: completedRequest.rows[0],
        donation: donationResult.rows[0],
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  } finally {
    client.release();
  }
};
const donationHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const role = req.user.role;

    // 1. Check role
    if (role !== "DONOR") {
      return res.status(403).json({
        success: false,
        message: "Only donors can access their donation history.",
      });
    }

    // 2. Get donor_id
    const donorResult = await pool.query(
      `SELECT donor_id
       FROM donors
       WHERE user_id = $1`,
      [userId],
    );

    if (donorResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found.",
      });
    }

    const donorId = donorResult.rows[0].donor_id;

    // 3. Get donation history
    const historyResult = await pool.query(
      `SELECT
          dh.donation_id,
          dh.request_id,
          dh.hospital_id,
          h.hospital_name,
          dh.blood_group,
          dh.units_donated,
          dh.donated_at,
          dh.remarks,
          br.patient_name,
          br.city,
          br.hospital_address
       FROM donation_history dh
       JOIN blood_requests br
         ON dh.request_id = br.request_id
       JOIN hospitals h
         ON dh.hospital_id = h.hospital_id
       WHERE dh.donor_id = $1
       ORDER BY dh.donated_at DESC`,
      [donorId],
    );

    // 4. Return history
    return res.status(200).json({
      success: true,
      count: historyResult.rowCount,
      donations: historyResult.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
module.exports = {
  getOpenBloodRequests,
  createBloodRequest,
  getAllBloodRequests,
  getMyBloodRequests,
  getBloodRequestById,
  respondToBloodRequest,
  getBloodRequestResponses,
  bloodAccepted,
  completeBloodRequest,
  donationHistory,
};
