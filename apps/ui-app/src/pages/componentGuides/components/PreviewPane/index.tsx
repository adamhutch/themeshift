import { useMemo, useState } from 'react';
import styles from './PreviewPane.module.scss';

export type PreviewPaneSwatch = {
  label: string;
  sample: React.ReactNode;
};

export type PreviewPaneProps = {
  swatches: PreviewPaneSwatch[];
};

export const PreviewPane = ({ swatches }: PreviewPaneProps) => {
  const [activeSwatch, setActiveSwatch] = useState(swatches[0].label);

  const sample = useMemo(
    () => swatches.find((s) => s.label === activeSwatch)?.sample ?? 'foo',
    [activeSwatch, swatches]
  );

  return (
    <div className={styles.container}>
      <div className={styles.swatches}>
        {swatches?.map(({ label }) => (
          <button
            className={styles.swatchButton}
            aria-pressed={activeSwatch === label}
            onClick={() => setActiveSwatch(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.content}>{sample}</div>
    </div>
  );
};
