export type NotExportedProps = {
  value?: string;
};

export const NotExported = ({ value = 'hidden' }: NotExportedProps) => null;
