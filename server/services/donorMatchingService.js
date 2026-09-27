const pool = require("../config/db");

const findNearbyDonors = async (requestId, radiusKm) => {
  const requestResult = await pool.query(
    `SELECT
        br.blood_group,
        h.latitude,
        h.longitude,
        h.city
     FROM blood_requests br
     JOIN hospitals h
       ON br.hospital_id = h.hospital_id
     WHERE br.request_id = $1`,
    [requestId],
  );

  if (requestResult.rowCount === 0) {
    throw new Error("Blood request not found.");
  }

  const request = requestResult.rows[0];

  if (request.latitude === null || request.longitude === null) {
    throw new Error("Hospital location is not available.");
  }

  const donorsResult = await pool.query(
    `SELECT *
     FROM (
        SELECT
            d.donor_id,
            d.user_id,
            u.full_name,
            u.phone,
            u.email,
            d.blood_group,
            d.city,
            d.latitude,
            d.longitude,

            (
              6371 * acos(
                LEAST(
                  1,
                  GREATEST(
                    -1,
                    cos(radians($1))
                    * cos(radians(d.latitude))
                    * cos(
                        radians(d.longitude)
                        - radians($2)
                      )
                    + sin(radians($1))
                    * sin(radians(d.latitude))
                  )
                )
              )
            ) AS distance_km

        FROM donors d

        JOIN users u
          ON d.user_id = u.user_id

        WHERE d.blood_group = $3
          AND d.city = $4
          AND d.available_for_requests = true
          AND d.eligibility_status = true
          AND d.latitude IS NOT NULL
          AND d.longitude IS NOT NULL

          AND d.latitude BETWEEN
              $1 - ($5 / 111.0)
              AND
              $1 + ($5 / 111.0)

          AND d.longitude BETWEEN
              $2 - (
                $5 / (111.0 * cos(radians($1)))
              )
              AND
              $2 + (
                $5 / (111.0 * cos(radians($1)))
              )
     ) AS nearby

     WHERE distance_km <= $5
     ORDER BY distance_km ASC`,
    [
      request.latitude,
      request.longitude,
      request.blood_group,
      request.city,
      radiusKm,
    ],
  );

  return {
    request,
    donors: donorsResult.rows,
  };
};

module.exports = {
  findNearbyDonors,
};
