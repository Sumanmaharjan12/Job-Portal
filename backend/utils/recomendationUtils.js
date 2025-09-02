function normalizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map(s => String(s).trim().toLowerCase()).filter(Boolean))];
}

function normalizeString(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace(/\s+/g, " ").toLowerCase();
}

// Cosine similarity for two arrays of terms
function cosineSimilarity(aArr, bArr) {
  const vocab = [...new Set([...aArr, ...bArr])];
  if (!vocab.length) return 0;

  const aVec = vocab.map(term => (aArr.includes(term) ? 1 : 0));
  const bVec = vocab.map(term => (bArr.includes(term) ? 1 : 0));

  const dot = aVec.reduce((sum, val, i) => sum + val * bVec[i], 0);
  const magA = Math.sqrt(aVec.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(bVec.reduce((sum, val) => sum + val * val, 0));

  return magA && magB ? dot / (magA * magB) : 0;
}

function scoreJobForUser(job, profile, skillThreshold = 0.5) {
  const userSkills = normalizeArray(profile.skills);
  const jobSkills = normalizeArray(job.skills);

  const skillScore = cosineSimilarity(userSkills, jobSkills);
  const matchedSkills = jobSkills.filter(s => userSkills.includes(s));

  if (skillScore < skillThreshold) {
    return {
      score: 0,
      matchedSkills: {
        skills: matchedSkills,
        experience: "Not matched",
        qualification: "Not matched",
        language: "Not matched",
        softSkills: "Not matched"
      }
    };
  }

  // Experience (binary equality, can be expanded to numeric years)
  const profileExp = normalizeString(profile.experience);
  const jobExp = normalizeString(job.experience);
  const expScore = profileExp && jobExp && profileExp === jobExp ? 1 : 0;

  // Qualification (binary equality for now)
  const profileEdu = normalizeString(profile.qualification);
  const jobEdu = normalizeString(job.qualification);
  const eduScore = profileEdu && jobEdu && profileEdu === jobEdu ? 1 : 0;

  // Languages with cosine similarity
  const userLangs = Array.isArray(profile.language)
    ? normalizeArray(profile.language)
    : normalizeString(profile.language)
    ? [normalizeString(profile.language)]
    : [];
  const jobLangs = Array.isArray(job.language)
    ? normalizeArray(job.language)
    : normalizeString(job.language)
    ? [normalizeString(job.language)]
    : [];
  const langScore = cosineSimilarity(userLangs, jobLangs);

  // Soft skills with cosine similarity
  const userSoft = Array.isArray(profile.softSkills)
    ? normalizeArray(profile.softSkills)
    : normalizeString(profile.softSkills)
    ? [normalizeString(profile.softSkills)]
    : [];
  const jobSoft = Array.isArray(job.softSkills)
    ? normalizeArray(job.softSkills)
    : normalizeString(job.softSkills)
    ? [normalizeString(job.softSkills)]
    : [];
  const softSkillScore = cosineSimilarity(userSoft, jobSoft);

  // Weights
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

  return {
    score: Number(score.toFixed(4)),
    matchedSkills: {
      skills: matchedSkills,
      experience: expScore ? job.experience : "Not matched",
      qualification: eduScore ? job.qualification : "Not matched",
      language: langScore > 0 ? job.language : "Not matched",
      softSkills: softSkillScore > 0 ? job.softSkills : "Not matched"
    }
  };
}

module.exports = { normalizeArray, normalizeString, cosineSimilarity, scoreJobForUser };
