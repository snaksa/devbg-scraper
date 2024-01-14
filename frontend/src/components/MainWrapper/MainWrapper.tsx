import { useSearchParams } from 'next/navigation';
import CategoryDetails from '@/components/CategoryDetails/CategoryDetails';
import Dashboard from '@/components/Dashboard/Dashboard';

export default function MainWrapper() {
  // const params = useSearchParams();
  // const categoryId = params.get('id');
  //
  // if (categoryId) {
  //   return <CategoryDetails id={categoryId} />;
  // }

  return <Dashboard />;
}
