/* Added so i18next-parser cli can add language variables correctly.
  t('English');
  t('Español');
*/
export const Languages = [
  {
    value: 'en-US',
    label: 'English',
  },
  /* {
    value: 'es-ES',
    label: 'Español',
  }, */
];
export interface Language {
  value: string;
  label: string;
}
