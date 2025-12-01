const QUALIFICATION_SCORES = {
  phd: 4,
  master: 3,
  bachelor: 2,
  diploma: 1,
};

function parseExperience(exp) {
  if (!exp) return 0;
  exp = exp.toLowerCase();
  if (exp.includes("fresher")) return 0;
  const match = exp.match(/(\d+)-?(\d+)?/);
  if (match) {
    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : start;
    return (start + end) / 2;
  }
  return 0;
}

function normalizeQualification(qual) {
  if (!qual) return "";
  qual = qual.toLowerCase();
  if (qual.includes("phd") || qual.includes("doctorate")) return "phd";
  if (qual.includes("master") || qual.includes("msc") || qual.includes("mba")) return "master";
  if (qual.includes("bachelor") || qual.includes("bsc") || qual.includes("ba")) return "bachelor";
  if (qual.includes("diploma")) return "diploma";
  return "";
}

function calculateScore(application, job) {
  const applicantSkills = (application.skills || []).map(s => s.toLowerCase());
  const jobSkills = (job.skills || []).map(s => s.toLowerCase());
  const matchedSkills = applicantSkills.filter(s => jobSkills.includes(s));
  const S = matchedSkills.length;

  const Q = QUALIFICATION_SCORES[normalizeQualification(application.qualification)] || 0;
  const E = Math.min(parseExperience(application.experience), 10);
  const C = application.cvUrl ? 1 : 0;
  const L = (application.location && job.location && application.location.toLowerCase() === job.location.toLowerCase()) ? 1 : 0;
  const O = (application.phone && application.email) ? 1 : 0;

  // Max possible for normalization
  const maxQ = 4; // phd
  const maxE = 10;
  const maxS = jobSkills.length; // all skills match
  const maxC = 1;
  const maxL = 1;
  const maxO = 1;

  // Weights (total should sum to 10)
  const Wq = 0.5, We = 1, Ws = 5, Wc = 1, Wl = 1, Wo = 1;

  const normalizedQ = (Q / maxQ) * Wq;
  const normalizedE = (E / maxE) * We;
  const normalizedS = (S / maxS) * Ws;
  const normalizedC = (C / maxC) * Wc;
  const normalizedL = (L / maxL) * Wl;
  const normalizedO = (O / maxO) * Wo;

  const totalScore = normalizedQ + normalizedE + normalizedS + normalizedC + normalizedL + normalizedO;

  return {
    totalScore: Number(totalScore.toFixed(2)), // round to 2 decimals
    breakdown: {
      qualification: Number(normalizedQ.toFixed(2)),
      experience: Number(normalizedE.toFixed(2)),
      skills: Number(normalizedS.toFixed(2)),
      matchedSkills,
      cv: Number(normalizedC.toFixed(2)),
      location: Number(normalizedL.toFixed(2)),
      contact: Number(normalizedO.toFixed(2))
    }
  };
}

module.exports = { calculateScore };
