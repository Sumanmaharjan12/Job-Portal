const Application = require('../models/application');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

const getAllApplicationsForAdmin = async (req, res) => {
  try {
    const { company, category, sortBy, page = 1, limit = 20, exportType } = req.query;


    let applications = await Application.find()
      .populate({
        path: 'job',
        select: 'title category skills postedBy',
        populate: [
          { path: 'postedBy', select: 'companyName companyAddress' },
          { path: 'category', select: 'name' } // populate category name
        ]
      })
      .populate('user', 'name email');

    // filters
    applications = applications.filter(app => {
      const companyMatch = company
        ? app.job?.postedBy?.companyName?.toLowerCase().includes(company.toLowerCase())
        : true;
      const categoryMatch = category
        ? app.job?.category?.name?.toLowerCase() === category.toLowerCase()
        : true;
      return companyMatch && categoryMatch;
    });

    //Sorting
    if (sortBy) {
      if (sortBy === 'company') {
        applications.sort((a, b) =>
          (a.job?.postedBy?.companyName || '').localeCompare(b.job?.postedBy?.companyName || '')
        );
      } else if (sortBy === 'category') {
        applications.sort((a, b) =>
          (a.job?.category?.name || '').localeCompare(b.job?.category?.name || '')
        );
      } else if (sortBy === 'date') {
        applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      }
    }

    //Format for frontend
    const formatted = applications.map(app => ({
      ApplicationID: app._id,
      AppliedAt: app.appliedAt,
      Status: app.status || '',
      ApplicantName: app.user?.name || app.name || '',
      ApplicantEmail: app.user?.email || app.email || '',
      Phone: app.phone || '',
      Location: app.location || '',
      Qualification: app.qualification || '',
      Experience: app.experience || '',
      Skills: app.skills?.join(', ') || '',
      JobTitle: app.job?.title || '',
      JobCategory: app.job?.category?.name || '',
      CompanyName: app.job?.postedBy?.companyName || '',
      CompanyAddress: app.job?.postedBy?.companyAddress || ''
    }));

    //Export as CSV
    if (exportType === 'csv') {
      const json2csv = new Parser();
      const csv = json2csv.parse(formatted);
      res.header('Content-Type', 'text/csv');
      res.attachment('applications.csv');
      return res.send(csv);
    }

    //Export as Excel
    if (exportType === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Applications');

      worksheet.columns = Object.keys(formatted[0] || {}).map(key => ({
        header: key,
        key: key,
        width: 25
      }));

      worksheet.addRows(formatted);

      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment('applications.xlsx');

      await workbook.xlsx.write(res);
      return res.end();
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginated = formatted.slice(start, end);

    res.status(200).json({
      total: formatted.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginated
    });

  } catch (err) {
    console.error('getAllApplicationsForAdmin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllApplicationsForAdmin };
