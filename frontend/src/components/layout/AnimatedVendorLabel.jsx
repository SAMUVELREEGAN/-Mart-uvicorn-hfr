import { useCmsContent } from '../../contexts';
import './AnimatedVendorLabel.css';

export default function AnimatedVendorLabel({ className = '' }) {
  const headerConfig = useCmsContent('header');
  const vendor = headerConfig.actions.vendor;
  const anim = vendor.animation;

  return (
    <span className={`animated-vendor-label ${className}`}>
      <span className="animated-vendor-label__static">{vendor.labelPrefix} </span>
      <span
        className="animated-vendor-label__animated"
        style={{
          '--anim-duration': anim.duration,
          '--anim-color-1': anim.colors[0],
          '--anim-color-2': anim.colors[1],
          '--anim-color-3': anim.colors[2],
        }}
      >
        {vendor.labelAnimated}
      </span>
    </span>
  );
}
