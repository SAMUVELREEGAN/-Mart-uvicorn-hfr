const HighlightCategory = require('../models/HighlightCategory');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { getNextId } = require('../utils/idGenerator');

const crud = createCrudController(HighlightCategory, 'highlightCategory', ['title', 'slug']);

exports.list = crud.list;
exports.getOne = crud.getOne;
exports.update = crud.update;
exports.remove = crud.remove;
exports.toggleStatus = crud.toggleStatus;

const slugify = (text) => String(text)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

exports.create = asyncHandler(async (req, res) => {
  const id = await getNextId('highlightCategory');
  const slug = req.body.slug || slugify(req.body.title);
  const item = await HighlightCategory.create({
    id,
    slug,
    title: req.body.title,
    subtitle: req.body.subtitle || '',
    image: req.body.image || '',
    mappingType: req.body.mappingType,
    categorySlugs: req.body.categorySlugs || [],
    subcategorySlugs: req.body.subcategorySlugs || [],
    sortOrder: req.body.sortOrder || 0,
    status: req.body.status || 'active',
    detailsPageTemplate: req.body.detailsPageTemplate || 'template1',
  });
  return success(res, item.toJSON(), 'Created', 201);
});
