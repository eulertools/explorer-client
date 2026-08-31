import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SettingsForm from 'src/components/dashboard/settings/SettingsForm';

export const SettingsTab = () => (
  <Card>
    <CardContent>
      <SettingsForm />
    </CardContent>
  </Card>
);
