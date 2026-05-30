const prisma = require('../config/prisma');

const getReportUpdates = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (user.role === 'mahasiswa' && report.userId !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updates = await prisma.reportUpdate.findMany({
      where: { reportId: parseInt(id, 10) },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report updates' });
  }
};

const createReportUpdate = async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const { user } = req;

  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const newUpdate = await prisma.reportUpdate.create({
      data: {
        reportId: parseInt(id, 10),
        userId: user.id,
        status,
        note,
      },
    });

    await prisma.report.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report update' });
  }
};

module.exports = {
  getReportUpdates,
  createReportUpdate,
};
