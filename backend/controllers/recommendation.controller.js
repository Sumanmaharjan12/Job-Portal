const Job = require("../models/job");
const UserProfile = require("../models/user-profile");
const {scoreJobForUser} = require("../utils/recomendationUtils");

const getRecommendations = async(req, res) => {
    try{
         const userId = req.user._id;
        const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);


        const profile = await UserProfile.findOne({userId}).lean();
        if(!profile){
            return res.status(404).json({message: "User profile not found"});
        }

        const jobs = await Job.find({status:"posted"})
        .populate("postedBy", "_id companyName imageUrl")
        .populate("category", "name")   // ← add this line
          .lean();
        const scoredJobs = jobs.map(job => {
            const {score, matchedSkills} = scoreJobForUser(job, profile);
            return{
                ...job,
                _score : Number(score.toFixed(4)),
                _matchedSkills: matchedSkills
            };
        });

        const topJobs = scoredJobs
        .filter(j => j._score>0)
        .sort((a,b) => b._score - a._score)
        .slice(0,limit);

        res.json({
            userId,
            total: topJobs.length,
            recommendations: topJobs
        });
    } catch (err){
        console.error("Error in getRecommendations:",err);
        res.status(500).json({message:"server error while generating recommendations"});

    }
};

module.exports={getRecommendations};