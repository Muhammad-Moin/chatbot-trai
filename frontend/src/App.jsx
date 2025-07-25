import "aos/dist/aos.css";
import AOS from "aos";

import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// defaultTheme
import themes from './admin/themes';

// project imports
import NavigationScroll from './admin/layout/NavigationScroll';
import {QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import Router from "./app-routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ==============================|| APP ||============================== //
const queryClient = new QueryClient();
// Create a client
const App = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  
  
  const customization = useSelector((state) => state.customization);
  const routes = useRoutes(Router)
  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll> 
          <ToastContainer position="top-right" limit={3} />
          {routes}
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
};

export default App;
