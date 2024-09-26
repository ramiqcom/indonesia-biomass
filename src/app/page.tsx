export const dynamic = 'force';

import Main from '@/components/main';
import { years } from '@/data/lc.json';
import { getLayer } from '@/module/layer';

export default async function Home() {
  const year = years.at(-1);
  const firstUrlDict = await getLayer(year);

  return (
    <>
      <Main defaultStates={{ firstUrlDict, defaultYear: year }} />
    </>
  );
}
