const buildListQuery = (req, searchableFields = ['name']) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    sort = '-createdAt',
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    }));
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  return { query, pageNum, limitNum, skip, sort };
};

const createCrudController = (Model, counterName, searchableFields = ['name']) => {
  const list = async (req, res) => {
    const { query, pageNum, limitNum, skip, sort } = buildListQuery(req, searchableFields);
    const [items, total] = await Promise.all([
      Model.find(query).sort(sort).skip(skip).limit(limitNum),
      Model.countDocuments(query),
    ]);
    return res.json({
      success: true,
      message: 'Success',
      data: items.map((i) => i.toJSON()),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  };

  const getAll = async (req, res) => {
    const query = { status: 'active' };
    const items = await Model.find(query).sort('id');
    return res.json({ success: true, message: 'Success', data: items.map((i) => i.toJSON()) });
  };

  const getOne = async (req, res) => {
    const item = await Model.findOne({ id: Number(req.params.id) });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Success', data: item.toJSON() });
  };

  const create = async (req, res) => {
    const { getNextId } = require('../utils/idGenerator');
    const id = await getNextId(counterName);
    const item = await Model.create({ id, ...req.body });
    return res.status(201).json({ success: true, message: 'Created', data: item.toJSON() });
  };

  const update = async (req, res) => {
    const item = await Model.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Updated', data: item.toJSON() });
  };

  const remove = async (req, res) => {
    const item = await Model.findOneAndDelete({ id: Number(req.params.id) });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Deleted', data: null });
  };

  const toggleStatus = async (req, res) => {
    const item = await Model.findOne({ id: Number(req.params.id) });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    item.status = item.status === 'active' ? 'inactive' : 'active';
    await item.save();
    return res.json({ success: true, message: 'Status updated', data: item.toJSON() });
  };

  return { list, getAll, getOne, create, update, remove, toggleStatus };
};

module.exports = { buildListQuery, createCrudController };
