'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
import { UserAuth } from '@/context/AuthContext';

const pages = ['Projects', 'Contracts', 'Timesheets', 'People'];

function Header() {
  const { user, googleSignIn, logOut, photoUrl } = UserAuth();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  return (
    <AppBar className="dark:bg-slate-800" position="static">
      <Toolbar disableGutters>
        <Container maxWidth="xl">
          {user ? (
            <Box>
              {pages.map((page) => (
                <Link href={`/${page.toLowerCase()}`} key={page}>
                  <Button color="inherit">{page}</Button>
                </Link>
              ))}

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.displayName} src={photoUrl as string} />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                className='top-0 right-0'
              >
                <MenuItem onClick={logOut}>
                  <Typography variant="inherit">Sign out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button className='' variant="outlined" onClick={googleSignIn}>Sign in</Button>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
}
export default Header;