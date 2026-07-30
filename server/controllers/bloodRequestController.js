const createBloodRequest = async (req, res) => {
  const { blood_type, quantity, hospital_id, urgency_level } = req.body;
};
const getAllBloodRequests = async (req, res) => {};
const getBloodRequestById = async (req, res) => {};
const updateBloodRequest = async (req, res) => {};
const deleteBloodRequest = async (req, res) => {};
module.exports = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
};
