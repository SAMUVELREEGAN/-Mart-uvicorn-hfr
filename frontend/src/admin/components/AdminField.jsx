import { previewUrl, deleteAdminFile, uploadAdminFile } from '../utils/upload';

export default function AdminField({ field, form, setForm, uploadImage }) {
  const value = form[field.name] ?? '';
  const isMedia = field.type === 'image' || field.type === 'icon';

  if (field.type === 'textarea') {
    return (
      <textarea
        id={field.name}
        className="adm-input adm-input--textarea"
        value={value}
        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
        required={field.required}
        rows={4}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        id={field.name}
        className="adm-input adm-select"
        value={value}
        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
        required={field.required}
      >
        {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  if (field.type === 'boolean') {
    return (
      <label className="adm-checkbox">
        <input
          id={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })}
        />
        <span>{value ? 'Enabled' : 'Disabled'}</span>
      </label>
    );
  }

  if (isMedia) {
    const handleUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (uploadImage) {
        uploadImage(e, field.name);
        return;
      }
      try {
        const url = await uploadAdminFile(file);
        setForm((prev) => ({ ...prev, [field.name]: url }));
      } catch {
        /* parent handles error */
      }
    };

    const handleRemove = async () => {
      await deleteAdminFile(value);
      setForm((prev) => ({ ...prev, [field.name]: '' }));
    };

    return (
      <div className={`adm-image-field ${field.type === 'icon' ? 'adm-image-field--icon' : ''}`}>
        <label className="adm-upload-btn">
          {field.type === 'icon' ? 'Upload Icon (SVG, PNG, JPG, WEBP)' : 'Upload Image (SVG, PNG, JPG, WEBP)'}
          <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/*" hidden onChange={handleUpload} />
        </label>
        {value && (
          <div className="adm-image-preview">
            <img src={previewUrl(value)} alt="" className={field.type === 'icon' ? 'adm-image-preview--icon' : ''} />
            <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={handleRemove}>
              Remove
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      id={field.name}
      className="adm-input"
      type={field.type === 'date' ? 'date' : field.type || 'text'}
      value={field.type === 'date' && value ? String(value).slice(0, 10) : value}
      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
      required={field.required}
    />
  );
}

export function AdminFieldGrid({ fields, form, setForm, uploadImage, columns = 2 }) {
  return (
    <div className={`adm-field-grid adm-field-grid--${columns}`}>
      {fields.map((field) => (
        <div key={field.name} className={`adm-field ${field.fullWidth ? 'adm-field--full' : ''}`}>
          <label htmlFor={field.name} className="adm-field__label">
            {field.label}
            {field.required && <span className="adm-field__required">*</span>}
          </label>
          <AdminField field={field} form={form} setForm={setForm} uploadImage={uploadImage} />
          {field.hint && <span className="adm-field__hint">{field.hint}</span>}
        </div>
      ))}
    </div>
  );
}
