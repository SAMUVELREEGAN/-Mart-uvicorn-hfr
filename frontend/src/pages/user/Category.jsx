import { useCategoryPageData } from '../../hooks/useCategoryPageData';
import { resolveCategoryDetailsTemplate } from '../../components/categoryDetails/categoryDetailsTemplates';
import CategoryDetailsLoading from '../../components/categoryDetails/CategoryDetailsLoading';
import Template3Loading from '../../components/categoryDetails/Template3Loading';

export default function Category() {
  const pageData = useCategoryPageData();
  const { loading, isService, detailsTemplate } = pageData;

  if (loading) {
    if (detailsTemplate === 'template3') {
      return <Template3Loading />;
    }
    return <CategoryDetailsLoading isService={isService} />;
  }

  const Template = resolveCategoryDetailsTemplate(detailsTemplate);
  return <Template {...pageData} />;
}
