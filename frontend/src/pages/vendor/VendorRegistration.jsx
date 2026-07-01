import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useVendorConfig } from '../../contexts/VendorConfigContext';
import DynamicVendorForm from '../../components/forms/DynamicVendorForm';
import Button from '../../components/common/Button';
import { Icon } from '../../utils/iconResolver';
import api, { getData } from '../../services/api';
import {
  buildInitialValues,
  isFieldVisible,
  validateDynamicFields,
} from '../../utils/vendorFormUtils';
import { getVendorPostAuthPath } from '../../utils/vendorRedirect';
import './VendorRegistration.css';

function getFieldsForSection(section, allFields) {
  return allFields
    .filter((f) => {
      if (f.sectionId) return f.sectionId === section.id;
      return f.stepKey === section.stepKey && f.sectionSortOrder === section.sortOrder;
    })
    .filter((f) => f.stepKey === section.stepKey)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export default function VendorRegistration() {
  const { vendor, setVendor, isVendor } = useAuth();
  const { config, loading: configLoading } = useVendorConfig();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(vendor?.registrationStep || 0);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [acceptBusinessTerms, setAcceptBusinessTerms] = useState(false);
  const [acceptPlatformTerms, setAcceptPlatformTerms] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(vendor?.selectedPlanId || null);
  const [submitting, setSubmitting] = useState(false);

  const { ui, steps, sections, fields, terms, plans } = config;
  const sortedSteps = useMemo(
    () => [...steps].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [steps],
  );
  const currentStep = sortedSteps[stepIndex];

  useEffect(() => {
    if (!isVendor) return;
    if (vendor?.approvalStatus === 'pending') {
      navigate('/vendor/pending-approval', { replace: true });
      return;
    }
    if (vendor?.approvalStatus === 'approved' && vendor?.status === 'active') {
      navigate('/vendor/dashboard', { replace: true });
    }
  }, [vendor, isVendor, navigate]);

  useEffect(() => {
    if (vendor && fields.length) {
      setValues(buildInitialValues(fields, vendor));
      setStepIndex(vendor.registrationStep || 0);
      if (vendor.selectedPlanId) setSelectedPlanId(vendor.selectedPlanId);
    }
  }, [vendor, fields]);

  const stepSections = useMemo(() => {
    if (!currentStep) return [];
    return sections
      .filter((s) => s.stepKey === currentStep.key)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [sections, currentStep]);

  const currentFields = useMemo(() => {
    if (!currentStep || currentStep.stepType !== 'form') return [];
    if (stepSections.length) {
      return stepSections.flatMap((section) => getFieldsForSection(section, fields));
    }
    return fields
      .filter((f) => f.stepKey === currentStep.key)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [currentStep, stepSections, fields]);

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const saveProgress = async (nextIndex) => {
    const res = await api.patch('/vendor/registration', {
      stepIndex: nextIndex,
      values,
    });
    const data = getData(res);
    if (data) setVendor(data);
  };

  const validateCurrentStep = () => {
    if (!currentStep) return true;
    if (currentStep.stepType === 'form') {
      const visibleFields = currentFields.filter((f) => isFieldVisible(f, values));
      const fieldErrors = validateDynamicFields(visibleFields, values);
      setErrors(fieldErrors);
      return !Object.keys(fieldErrors).length;
    }
    if (currentStep.stepType === 'terms') {
      if (currentStep.termsType === 'business' && !acceptBusinessTerms) return false;
      if (currentStep.termsType === 'platform' && !acceptPlatformTerms) return false;
    }
    if (currentStep.stepType === 'pricing' && !selectedPlanId) return false;
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;
    const nextIndex = Math.min(stepIndex + 1, sortedSteps.length - 1);
    try {
      setSubmitting(true);
      await saveProgress(nextIndex);
      setStepIndex(nextIndex);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    try {
      setSubmitting(true);
      const res = await api.post('/vendor/registration/submit', {
        values,
        selectedPlanId,
        acceptBusinessTerms,
        acceptPlatformTerms,
      });
      const data = getData(res);
      if (data) {
        setVendor(data);
        navigate(getVendorPostAuthPath(data), { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const termsDoc = terms.find((t) => t.type === currentStep?.termsType);
  const progressLabel = (ui.stepProgress || 'Step {current} of {total}')
    .replace('{current}', String(stepIndex + 1))
    .replace('{total}', String(sortedSteps.length));

  if (configLoading || !currentStep) {
    return (
      <div className="vendor-registration">
        <p className="vendor-registration__loading">{ui.loading}</p>
      </div>
    );
  }

  const isLastStep = stepIndex === sortedSteps.length - 1;
  const backBtn = ui.buttons?.back;
  const nextBtn = isLastStep ? ui.buttons?.submit : ui.buttons?.next;

  return (
    <div className="vendor-registration">
      <div className="vendor-registration__card">
        <header className="vendor-registration__header">
          <p className="vendor-registration__progress">{progressLabel}</p>
          <h1 className="vendor-registration__title">{currentStep.title}</h1>
          {currentStep.subtitle && (
            <p className="vendor-registration__subtitle">{currentStep.subtitle}</p>
          )}
        </header>

        <div className="vendor-registration__steps">
          {sortedSteps.map((step, i) => (
            <span
              key={step.key}
              className={`vendor-registration__step-dot ${i <= stepIndex ? 'vendor-registration__step-dot--active' : ''} ${i === stepIndex ? 'vendor-registration__step-dot--current' : ''}`}
            />
          ))}
        </div>

        <div className="vendor-registration__body">
          {currentStep.stepType === 'form' && (
            <DynamicVendorForm
              sections={stepSections}
              fields={fields.filter((f) => f.stepKey === currentStep.key)}
              values={values}
              errors={errors}
              onChange={handleChange}
            />
          )}

          {currentStep.stepType === 'terms' && termsDoc && (
            <div className="vendor-registration__terms">
              <h2 className="vendor-registration__terms-title">{termsDoc.title}</h2>
              <div className="vendor-registration__terms-content">{termsDoc.content}</div>
              <p className="vendor-registration__terms-hint">{ui.terms?.scrollHint}</p>
              <label className="vendor-registration__terms-check">
                <input
                  type="checkbox"
                  checked={currentStep.termsType === 'business' ? acceptBusinessTerms : acceptPlatformTerms}
                  onChange={(e) => {
                    if (currentStep.termsType === 'business') setAcceptBusinessTerms(e.target.checked);
                    else setAcceptPlatformTerms(e.target.checked);
                  }}
                />
                <span>{termsDoc.acceptanceLabel}</span>
              </label>
            </div>
          )}

          {currentStep.stepType === 'pricing' && (
            <div className="vendor-registration__plans">
              <p className="vendor-registration__plans-label">{ui.pricing?.selectLabel}</p>
              <div className="vendor-registration__plans-grid">
                {[...plans].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((plan) => (
                  <button
                    key={plan.id || plan.key}
                    type="button"
                    className={`vendor-registration__plan ${selectedPlanId === plan.id ? 'vendor-registration__plan--selected' : ''} ${plan.highlighted ? 'vendor-registration__plan--highlighted' : ''}`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <h3>{plan.name}</h3>
                    <p className="vendor-registration__plan-price">
                      {plan.priceLabel || (plan.price === 0 ? ui.pricing?.freeLabel : `$${plan.price}${ui.pricing?.perMonthLabel || ''}`)}
                    </p>
                    <p className="vendor-registration__plan-desc">{plan.description}</p>
                    {plan.features?.length > 0 && (
                      <ul className="vendor-registration__plan-features">
                        <li className="vendor-registration__plan-features-title">{ui.pricing?.featuresTitle}</li>
                        {plan.features.map((f) => (
                          <li key={f}><Icon name="FaCheck" /> {f}</li>
                        ))}
                      </ul>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="vendor-registration__actions">
          {stepIndex > 0 && backBtn && (
            <Button
              label={backBtn.label}
              icon={backBtn.icon}
              variant="outline"
              onClick={handleBack}
              disabled={submitting}
            />
          )}
          {nextBtn && (
            <Button
              label={nextBtn.label}
              icon={nextBtn.icon}
              variant="primary"
              onClick={isLastStep ? handleSubmit : handleNext}
              disabled={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
