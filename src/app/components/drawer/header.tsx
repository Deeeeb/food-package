import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

interface ChildProps {
    clickDrawerOpen: any;
    open: boolean;
}
  const Header: React.FC<ChildProps> = ({open, clickDrawerOpen }) => {
    return (
        <AppBar className='bg-gray-400 bg-opacity-95' position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=> clickDrawerOpen(true)}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
            <Typography variant="h6" noWrap component="div">
              Food Package
            </Typography>
          </Toolbar>
        </AppBar>
    )
}

export default Header;