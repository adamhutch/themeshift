import { ToggleSwitch } from '@themeshift/ui/components/ToggleSwitch';
import { useState } from 'react';

export const ControlledToggleSwitch = () => {
  const [checked, setChecked] = useState(false);

  return (
    <ToggleSwitch
      checked={checked}
      label={checked ? 'Backups on' : 'Backups off'}
      onCheckedChange={setChecked}
    />
  );
};
