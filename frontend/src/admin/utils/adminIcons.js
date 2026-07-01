import {
  FaBan,
  FaCheck,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaGripVertical,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
} from 'react-icons/fa';

export const ACTION_ICONS = {
  add: FaPlus,
  edit: FaEdit,
  delete: FaTrash,
  view: FaEye,
  save: FaSave,
  cancel: FaTimes,
  enable: FaCheck,
  disable: FaBan,
  reject: FaTimes,
  approve: FaCheck,
  grip: FaGripVertical,
  close: FaTimes,
  'eye-slash': FaEyeSlash,
};

export function resolveAdminIcon(icon) {
  if (!icon) return null;
  if (typeof icon === 'function') return icon;
  const key = String(icon).toLowerCase();
  return ACTION_ICONS[key] || null;
}

export function iconFromLabel(label) {
  if (!label || typeof label !== 'string') return null;
  const text = label.toLowerCase();
  if (text.includes('add')) return ACTION_ICONS.add;
  if (text.includes('delete')) return ACTION_ICONS.delete;
  if (text.includes('edit')) return ACTION_ICONS.edit;
  if (text.includes('view')) return ACTION_ICONS.view;
  if (text.includes('save')) return ACTION_ICONS.save;
  if (text.includes('cancel')) return ACTION_ICONS.cancel;
  if (text.includes('approve')) return ACTION_ICONS.approve;
  if (text.includes('reject')) return ACTION_ICONS.reject;
  if (text === 'enable' || text.includes('enable')) return ACTION_ICONS.enable;
  if (text.includes('disable')) return ACTION_ICONS.disable;
  return null;
}
