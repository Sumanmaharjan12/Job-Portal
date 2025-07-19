const moment = require('moment');

function validateBusiness(data){
    if(data.role === 'JobSeeker'){
        return { riskLevel: undefined, issues: [] };
    }

    const issues =[];

    if (
    !data.companyWebsite ||
    !/^https?:\/\/[\w.-]+\.[a-z]{2,}$/.test(data.companyWebsite)
  ) {
    issues.push('Invalid or missing company website.');
  }

    // established date
    const estDate = moment(data.establishedDate);
    if(!estDate.isValid() || moment().diff(estDate , 'months')<6){
        issues.push('company established less than 6 months ago.');
    }

    // job opening
    if(data.jobOpenings>20){
        issues.push('Suspiciously high number of job openings.');
    }

    // blacklistednames
    const blacklistedNames = ['Fake Co', 'Test Company' , 'Demo', 'Example'];
    if(
        data.companyName && blacklistedNames.includes(data.companyName.trim())
    ){
        issues.push('Blacklisted or generic company name');
    }

    // suspiciousAddress
    if(!data.companyAddress || data.companyAddress.toLowerCase().includes('fake')){
        issues.push('suspicious company address');
    }
    
    // risk leve
    let riskLevel = 'Safe';
    if(issues.length >=3) riskLevel = 'likely Fake';
    else if(issues.length>0) riskLevel = 'Suspicious';

    return{riskLevel, issues};
}

module.exports = {validateBusiness};
