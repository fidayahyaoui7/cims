import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { styled } from '@mui/material/styles';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true }
];

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  minWidth: 'auto',
  padding: '8px 12px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    handleClose();
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Box>
      <StyledButton
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<LanguageIcon />}
      >
        {currentLanguage.nativeName}
      </StyledButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            selected={i18n.language === language.code}
            onClick={() => changeLanguage(language.code)}
            sx={{
              direction: language.rtl ? 'rtl' : 'ltr',
              fontFamily: language.rtl ? '"Cairo", "Arial", sans-serif' : 'inherit',
            }}
          >
            {language.nativeName}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
