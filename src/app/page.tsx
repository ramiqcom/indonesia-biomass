export const dynamic = 'force';

import Main from '@/components/main';
import { years } from '@/data/lc.json';
import { lcLayer } from '@/module/layer';

export default async function Home() {
  const year = years.at(-1);
  const firstUrl = await lcLayer(year);

  return (
    <>
      <Main defaultStates={{ firstUrl, defaultYear: year }} />
    </>
  );
}
