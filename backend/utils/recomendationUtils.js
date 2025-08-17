function normalizeArray(arr){
    if(!Array.isArray(arr)) return [];
    return [...new Set(arr.map(s => String(s).trim().toLowerCase()).filter(Boolean))];
}

// jaccard similarity for array overlap
function jaccardSimilarity(aArr, bArr){
    const a = new Set(aArr);
    const b = new Set(bArr);
    if(!a.size && !b.size) return 0;
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    const union = a.size + b.size - inter;
    return inter / union
}

// calculate weighted score between a userprofile and a job
function scoreJobForUser(job,profile){
    const userSkills = normalizeArray(profile.skills);
    const jobSkills = normalizeArray(job.skills);

    const skillScore = jaccardSimilarity(userSkills, jobSkills);

    const expScore = profile.experience?.trim().toLowerCase() === job.experience?.trim().toLowerCase() ? 1 : 0;

    const eduScore = profile.qualification?.trim().toLowerCase() === job.qualification?.trim().toLowerCase() ? 1 : 0;

    const langScore = profile.language?.trim().toLowerCase() === job.language?.trim().toLowerCase() ? 1 : 0;

    const softSkillScore = profile.softSkills?.trim().toLowerCase() === job.softSkills?.trim().toLowerCase() ? 1 : 0;

    const W_SKILLS = 0.6;
    const W_EXP = 0.15;
    const W_EDU = 0.1;
    const W_LANG = 0.1;
    const W_SOFT = 0.05;

    const score = 
    W_SKILLS * skillScore +
    W_EXP * expScore +
    W_EDU * eduScore +
    W_LANG * langScore +
    W_SOFT * softSkillScore;

    const matchedSkills = jobSkills.filter(s => userSkills.includes(s));
    return {score, matchedSkills};
}
module.exports = {normalizeArray, jaccardSimilarity, scoreJobForUser};