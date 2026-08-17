const pool = require("../config/db.js");

const donorDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const role = req.user.role;

    // 1. Check role
    if (role !== "DONOR") {
      return res.status(403).json({
        success: false,
        message: "Only donors can view the donor dashboard.",
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
        message: "Donor not found.",
      });
    }

    const donorId = donorResult.rows[0].donor_id;

    // 3. Get dashboard statistics
    const dashboardResult = await pool.query(
      `SELECT
      -- Total completed donations
      COUNT(DISTINCT dh.donation_id) AS total_donations,

      -- Last donation date
      MAX(dh.donated_at) AS last_donation_date,

      -- Total units donated
      COALESCE(SUM(dh.units_donated), 0) AS total_units_donated,

      -- Pending responses
      COUNT(DISTINCT brr.response_id)
        FILTER (
          WHERE brr.status = 'PENDING'
        ) AS pending_responses,

      -- Selected donations
      COUNT(DISTINCT brr.response_id)
        FILTER (
          WHERE brr.status = 'SELECTED_BY_HOSPITAL'
        ) AS selected_donations,

      -- Completed donations
      COUNT(DISTINCT dh.donation_id) AS completed_donations

   FROM donors d

   LEFT JOIN donation_history dh
     ON d.donor_id = dh.donor_id

   LEFT JOIN blood_request_responses brr
     ON d.donor_id = brr.donor_id

   WHERE d.donor_id = $1`,
      [donorId],
    );
    const donorStatusResult = await pool.query(
      `SELECT eligibility_status
   FROM donors
   WHERE donor_id = $1`,
      [donorId],
    );

    const eligibilityStatus = donorStatusResult.rows[0].eligibility_status;
    const stats = dashboardResult.rows[0];

    // 4. Return dashboard
    return res.status(200).json({
      success: true,
      dashboard: {
        total_donations: Number(stats.total_donations),

        last_donation_date: stats.last_donation_date,

        eligibility_status: eligibilityStatus,

        total_units_donated: Number(stats.total_units_donated),

        pending_responses: Number(stats.pending_responses),

        selected_donations: Number(stats.selected_donations),

        completed_donations: Number(stats.completed_donations),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Hospital Dashboard - we'll implement this next
const hospitalDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const role = req.user.role;

    // 1. Check role
    if (role !== "HOSPITAL") {
      return res.status(403).json({
        success: false,
        message: "Only hospitals can view the hospital dashboard.",
      });
    }

    // 2. Get hospital_id
    const hospitalResult = await pool.query(
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

    // 3. Get dashboard statistics
    const dashboardResult = await pool.query(
      `SELECT
          COUNT(*) AS total_blood_requests,

          COUNT(*) FILTER (
            WHERE status = 'OPEN'
          ) AS open_requests,

          COUNT(*) FILTER (
            WHERE status = 'MATCHED'
          ) AS matched_requests,

          COUNT(*) FILTER (
            WHERE status = 'COMPLETED'
          ) AS completed_requests,

          COUNT(*) FILTER (
            WHERE status = 'CANCELLED'
          ) AS cancelled_requests,

          COALESCE(SUM(units_required), 0)
            AS total_units_requested

       FROM blood_requests
       WHERE hospital_id = $1`,
      [hospitalId],
    );

    const responseResult = await pool.query(
      `SELECT COUNT(DISTINCT brr.donor_id) AS total_donors_responded
       FROM blood_request_responses brr
       JOIN blood_requests br
         ON brr.request_id = br.request_id
       WHERE br.hospital_id = $1`,
      [hospitalId],
    );

    const stats = dashboardResult.rows[0];

    return res.status(200).json({
      success: true,
      dashboard: {
        total_blood_requests: Number(stats.total_blood_requests),
        open_requests: Number(stats.open_requests),
        matched_requests: Number(stats.matched_requests),
        completed_requests: Number(stats.completed_requests),
        cancelled_requests: Number(stats.cancelled_requests),
        total_donors_responded: Number(
          responseResult.rows[0].total_donors_responded,
        ),
        total_units_requested: Number(stats.total_units_requested),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
const adminDashboard = async (req, res) => {
  try {
    const role = req.user.role;

    // 1. Check role
    if (role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view the admin dashboard.",
      });
    }

    // 2. Get total donors
    const donorResult = await pool.query(
      `SELECT COUNT(*) AS total_donors
       FROM donors`,
    );

    // 3. Get total hospitals
    const hospitalResult = await pool.query(
      `SELECT COUNT(*) AS total_hospitals
       FROM hospitals`,
    );

    // 4. Get total blood banks
    const bloodBankResult = await pool.query(
      `SELECT COUNT(*) AS total_blood_banks
       FROM blood_banks`,
    );

    // 5. Get blood request statistics
    const requestResult = await pool.query(
      `SELECT
          COUNT(*) AS total_blood_requests,

          COUNT(*) FILTER (
            WHERE status = 'OPEN'
          ) AS open_requests,

          COUNT(*) FILTER (
            WHERE status = 'COMPLETED'
          ) AS completed_requests,

          COUNT(*) FILTER (
            WHERE status = 'CANCELLED'
          ) AS cancelled_requests

       FROM blood_requests`,
    );

    // 6. Get donation statistics
    const donationResult = await pool.query(
      `SELECT
          COUNT(*) AS total_donations,
          COALESCE(SUM(units_donated), 0) AS total_units_donated
       FROM donation_history`,
    );

    const requests = requestResult.rows[0];
    const donations = donationResult.rows[0];

    // 7. Return dashboard
    return res.status(200).json({
      success: true,
      dashboard: {
        total_donors: Number(donorResult.rows[0].total_donors),

        total_hospitals: Number(hospitalResult.rows[0].total_hospitals),

        total_blood_banks: Number(bloodBankResult.rows[0].total_blood_banks),

        total_blood_requests: Number(requests.total_blood_requests),

        open_requests: Number(requests.open_requests),

        completed_requests: Number(requests.completed_requests),

        cancelled_requests: Number(requests.cancelled_requests),

        total_donations: Number(donations.total_donations),

        total_units_donated: Number(donations.total_units_donated),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
module.exports = {
  donorDashboard,
  hospitalDashboard,
  adminDashboard,
};
