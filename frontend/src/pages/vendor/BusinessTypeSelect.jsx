import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sidebarConfig from '../../json/sidebar.json';
import { Icon } from '../../utils/iconResolver';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import './BusinessTypeSelect.css';

export default function BusinessTypeSelect() {
  const [selected, setSelected] = useState(null);
  const { setBusinessType } = useAuth();
  const navigate = useNavigate();
  const config = sidebarConfig.businessTypes;

  const handleContinue = () => {
    if (!selected) return;
    setBusinessType(selected);
    navigate('/vendor/register');
  };

  return (
    <div className="business-type">
      <div className="business-type__header">
        <h1 className="business-type__title">{config.title}</h1>
        <p className="business-type__subtitle">{config.subtitle}</p>
      </div>

      <div className="business-type__options">
        {config.options.map((option) => (
          <Card
            key={option.id}
            hoverable
            className={`business-type__option ${selected === option.id ? 'business-type__option--selected' : ''}`}
            onClick={() => setSelected(option.id)}
          >
            <div
              className="business-type__option-icon"
              style={{
                background: `${option.color}18`,
                color: option.color,
                borderColor: selected === option.id ? option.color : 'transparent',
              }}
            >
              <Icon name={option.icon} />
            </div>
            <h3 className="business-type__option-title">{option.title}</h3>
            <p className="business-type__option-desc">{option.description}</p>
            {selected === option.id && (
              <span className="business-type__check">
                <Icon name="FaCheckCircle" />
              </span>
            )}
          </Card>
        ))}
      </div>

      <div className="business-type__actions">
        <Button
          label={config.continueButton.label}
          icon={config.continueButton.icon}
          variant="primary"
          size="lg"
          disabled={!selected}
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}
