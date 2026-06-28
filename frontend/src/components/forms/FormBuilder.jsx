import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Rating from '../common/Rating';
import Button from '../common/Button';
import { validateForm } from '../../utils/helpers';
import { useCategories } from '../../contexts/CategoryContext';
import { useLocation } from '../../contexts/LocationContext';
import buttonsConfig from '../../json/buttons.json';
import './FormBuilder.css';

export default function FormBuilder({
  fields,
  onSubmit,
  submitKey = 'save',
  initialValues = {},
  cancelAction,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const { productCategories, serviceCategories } = useCategories();
  const { locations } = useLocation();

  const optionsMap = {
    productCategories: productCategories.map((c) => ({ value: c.id, label: c.name })),
    serviceCategories: serviceCategories.map((c) => ({ value: c.id, label: c.name })),
    locations: locations.map((l) => ({ value: l.id, label: l.name })),
  };

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => handleChange(key, ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(fields, values);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(values);
  };

  const submitBtn = buttonsConfig[submitKey] || buttonsConfig.save;

  const renderField = (field) => {
    const common = {
      key: field.key,
      name: field.key,
      label: field.label,
      value: values[field.key] || '',
      error: errors[field.key],
      required: field.required,
      icon: field.icon,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <TextArea
            {...common}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        );
      case 'select': {
        const options = field.options || optionsMap[field.optionsKey] || [];
        return (
          <Select
            {...common}
            options={options}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        );
      }
      case 'rating':
        return (
          <div key={field.key} className="form-builder__rating">
            <label className="form-builder__rating-label">
              {field.label}
              {field.required && <span className="form-builder__required">*</span>}
            </label>
            <Rating
              value={Number(values[field.key]) || 0}
              onChange={(val) => handleChange(field.key, val)}
              showValue={false}
            />
            {errors[field.key] && <span className="form-builder__error">{errors[field.key]}</span>}
          </div>
        );
      case 'file':
        return (
          <div key={field.key} className="form-builder__file">
            <Input
              {...common}
              type="file"
              accept={field.accept}
              value=""
              onChange={(e) => handleFileChange(field.key, e)}
            />
            {values[field.key] && (
              <img src={values[field.key]} alt="Preview" className="form-builder__preview" />
            )}
          </div>
        );
      default:
        return (
          <Input
            {...common}
            type={field.type}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        );
    }
  };

  return (
    <form className="form-builder" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.key}>{renderField(field)}</div>
      ))}
      <div className="form-builder__actions">
        {cancelAction && (
          <Button
            label={buttonsConfig.cancel.label}
            variant={buttonsConfig.cancel.variant}
            icon={buttonsConfig.cancel.icon}
            onClick={cancelAction}
          />
        )}
        <Button
          label={submitBtn.label}
          variant={submitBtn.variant}
          icon={submitBtn.icon}
          type="submit"
        />
      </div>
    </form>
  );
}
