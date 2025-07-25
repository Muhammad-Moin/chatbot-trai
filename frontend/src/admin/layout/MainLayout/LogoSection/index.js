import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase, Typography } from '@mui/material';

// project imports
// import Logo from 'admin/ui-component/Logo';
import { MENU_OPEN } from '../../../store/actions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to="/admin/dashboard/default">
      {/* <Logo /> */}
      <AdminPanelSettingsIcon sx={{ fontSize: 48, color: '#5e35b1' }} />
      <Typography variant="h4">French ChatBot Admin</Typography>
    </ButtonBase>
  );
};

export default LogoSection;
