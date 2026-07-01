export function getFieldSections(config) {
  if (config.fieldSections?.length) {
    return config.fieldSections.map((section) => ({
      ...section,
      fieldDefs: section.fields
        .map((name) => config.fields.find((f) => f.name === name))
        .filter(Boolean),
    }));
  }
  return [{ id: 'default', title: 'Details', fieldDefs: config.fields }];
}

export function getFieldsByNames(config, names) {
  return names.map((name) => config.fields.find((f) => f.name === name)).filter(Boolean);
}
