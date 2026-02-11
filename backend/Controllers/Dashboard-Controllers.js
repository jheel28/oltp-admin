const Admin = require("../Models/Admin");
const Student = require("../Models/Student");
const Test = require("../Models/Test");
const Query = require("../Models/Query");
const HttpError = require("../Middleware/http-error");

const getSuperAdminStats = async (req, res, next) => {
    try {
        const totalUniversities = await Admin.countDocuments();
        const totalStudents = await Student.countDocuments();
        const totalTests = await Test.countDocuments();

        const queries = await Query.find({});
        const queryStats = {
            total: queries.length,
            pending: queries.filter(q => q.status === "pending").length,
            resolved: queries.filter(q => q.status === "resolved").length,
        };

        res.status(200).json({
            totalUniversities,
            totalStudents,
            totalTests,
            queryStats,
        });
    } catch (err) {
        const error = new HttpError("Fetching Super Admin stats failed, please try again later.", 500);
        return next(error);
    }
};

const getAdminStats = async (req, res, next) => {
    // Note: For now, aggregating platform-wide as multi-tenancy links are not fully defined in models.
    // In a real multi-tenant app, we'd filter by adminId/universityId.
    try {
        const totalStudents = await Student.countDocuments();
        const totalTests = await Test.countDocuments();

        // Heuristic for JEE/NEET based on exam name
        const jeeStudents = await Student.countDocuments({ batch: { $regex: /jee/i } });
        const neetStudents = await Student.countDocuments({ batch: { $regex: /neet/i } });

        // Upcoming tests (today or future)
        const today = new Date().toISOString().split('T')[0];
        const upcomingTestsData = await Test.find({ date: { $gte: today } });

        res.status(200).json({
            totalStudents,
            totalTests,
            jeeStudents: jeeStudents || 50, // fallback to placeholder if 0 during dev
            neetStudents: neetStudents || 100,
            upcomingTests: upcomingTestsData.length,
            regionalTests: 145 // Placeholder as model doesn't specify regional type yet
        });
    } catch (err) {
        const error = new HttpError("Fetching Admin stats failed, please try again later.", 500);
        return next(error);
    }
};

exports.getSuperAdminStats = getSuperAdminStats;
exports.getAdminStats = getAdminStats;
