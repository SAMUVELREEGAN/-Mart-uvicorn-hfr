import { useCmsContent } from '../../contexts';

export default function CmsPage({ pageKey }) {
  const pages = useCmsContent('pages');
  const page = pages[pageKey] || {};

  return (
    <div className="page-placeholder">
      <h1>{page.title || pageKey}</h1>
      <p>{page.description || ''}</p>
    </div>
  );
}
