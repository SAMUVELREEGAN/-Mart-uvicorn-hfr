const VendorRegStep = require('../models/VendorRegStep');
const VendorFormSection = require('../models/VendorFormSection');
const VendorFormField = require('../models/VendorFormField');
const VendorTerms = require('../models/VendorTerms');
const VendorPricingPlan = require('../models/VendorPricingPlan');
const Setting = require('../models/Setting');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const { getNextId } = require('../utils/idGenerator');

const stepCrud = createCrudController(VendorRegStep, 'vendorRegStep', ['title', 'key']);
const sectionCrud = createCrudController(VendorFormSection, 'vendorFormSection', ['title', 'stepKey']);
const fieldCrud = createCrudController(VendorFormField, 'vendorFormField', ['label', 'name', 'stepKey']);
const termsCrud = createCrudController(VendorTerms, 'vendorTerms', ['title', 'type']);
const planCrud = createCrudController(VendorPricingPlan, 'vendorPricingPlan', ['name', 'key']);

exports.listSteps = stepCrud.list;
exports.getStep = stepCrud.getOne;
exports.createStep = stepCrud.create;
exports.updateStep = stepCrud.update;
exports.removeStep = stepCrud.remove;
exports.toggleStepStatus = stepCrud.toggleStatus;

exports.listSections = sectionCrud.list;
exports.getSection = sectionCrud.getOne;
exports.createSection = sectionCrud.create;
exports.updateSection = sectionCrud.update;
exports.removeSection = sectionCrud.remove;
exports.toggleSectionStatus = sectionCrud.toggleStatus;

exports.listFields = fieldCrud.list;
exports.getField = fieldCrud.getOne;
exports.createField = fieldCrud.create;
exports.updateField = fieldCrud.update;
exports.removeField = fieldCrud.remove;
exports.toggleFieldStatus = fieldCrud.toggleStatus;

exports.listTerms = termsCrud.list;
exports.getTerms = termsCrud.getOne;
exports.createTerms = termsCrud.create;
exports.updateTerms = termsCrud.update;
exports.removeTerms = termsCrud.remove;
exports.toggleTermsStatus = termsCrud.toggleStatus;

exports.listPlans = planCrud.list;
exports.getPlan = planCrud.getOne;
exports.createPlan = planCrud.create;
exports.updatePlan = planCrud.update;
exports.removePlan = planCrud.remove;
exports.togglePlanStatus = planCrud.toggleStatus;

const reorder = (Model) => asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return error(res, 'items array required', 400);
  await Promise.all(items.map(({ id, sortOrder }) => (
    Model.updateOne({ id: Number(id) }, { sortOrder: Number(sortOrder) })
  )));
  return success(res, null, 'Order updated');
});

exports.reorderSteps = reorder(VendorRegStep);
exports.reorderSections = reorder(VendorFormSection);
exports.reorderFields = reorder(VendorFormField);
exports.reorderTerms = reorder(VendorTerms);
exports.reorderPlans = reorder(VendorPricingPlan);

exports.getPublicConfig = asyncHandler(async (req, res) => {
  const [steps, sections, fields, terms, plans, uiSetting] = await Promise.all([
    VendorRegStep.find({ status: 'active' }).sort('sortOrder'),
    VendorFormSection.find({ status: 'active' }).sort('sortOrder'),
    VendorFormField.find({ status: 'active' }).sort('sortOrder'),
    VendorTerms.find({ status: 'active' }).sort('sortOrder'),
    VendorPricingPlan.find({ status: 'active' }).sort('sortOrder'),
    Setting.findOne({ key: 'vendor_registration_ui' }),
  ]);

  let ui = {};
  if (uiSetting?.type === 'json' && uiSetting.value) {
    try { ui = JSON.parse(uiSetting.value); } catch { ui = {}; }
  }

  return success(res, {
    ui,
    steps: steps.map((s) => s.toJSON()),
    sections: sections.map((s) => s.toJSON()),
    fields: fields.map((f) => f.toJSON()),
    terms: terms.map((t) => t.toJSON()),
    plans: plans.map((p) => p.toJSON()),
  });
});

exports.getUiConfig = asyncHandler(async (req, res) => {
  const setting = await Setting.findOne({ key: 'vendor_registration_ui' });
  if (!setting) return success(res, { key: 'vendor_registration_ui', value: {}, type: 'json' });
  return success(res, setting.toJSON());
});

exports.updateUiConfig = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne({ key: 'vendor_registration_ui' });
  const value = typeof req.body.value === 'string' ? req.body.value : JSON.stringify(req.body.value || {});
  if (!setting) {
    const id = await getNextId('setting');
    setting = await Setting.create({
      id,
      key: 'vendor_registration_ui',
      label: 'Vendor Registration UI',
      value,
      type: 'json',
      group: 'vendor',
      status: 'active',
    });
  } else {
    setting.value = value;
    setting.type = 'json';
    await setting.save();
  }
  return success(res, setting.toJSON(), 'UI config updated');
});
