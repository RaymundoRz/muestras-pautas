import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const items = [
    { text: 'Dashboard', path: '/' },
    { text: 'Muestras', path: '/muestras' },
    { text: 'Pautas', path: '/pautas' },
    { text: 'Reportes', path: '/reportes' }
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <List sx={{ width: 240, mt: 8 }}>
        {items.map(({ text, path }) => (
          <ListItem button component={NavLink} to={path} key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
