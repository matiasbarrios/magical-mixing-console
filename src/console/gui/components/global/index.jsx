// Requirements
import { useMemo } from 'react';
import {
    createMemoryRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from 'react-router';
import { DeviceProvider } from '@magical-mixing/mixers-react';
import routes from '../../routes';
import { useDevices } from '../devices/context';
import Layout from '../layout';
import { FallbackProvider } from '../fallback';
import { VaultProvider } from '../vault';
import { ActiveDeviceSceneProvider } from '../activeScene';
import { BootstrapProvider } from '../bootstrap';
import GlobalProvider from './context';
import GlobalHooks from './hooks';
import GlobalInitialization from './initialization';
import { AppActive } from './appActive';
import { MobileBack, MobileOfflineHaptics } from './mobile';
import { ChangesProgressDialog } from './changesProgress';
import { StructureErrorBoundary } from './errorBoundary';
import '../../style/main.css';


// Internal
const Content = ({ noHeader, device, children }) => (
    <DeviceProvider device={device}>
        <ActiveDeviceSceneProvider>
            <FallbackProvider>
                <VaultProvider>
                    <AppActive>
                        <BootstrapProvider>
                            <MobileOfflineHaptics>
                                {noHeader && children}
                                {!noHeader && (
                                    <Layout>
                                        {children}
                                    </Layout>
                                )}
                            </MobileOfflineHaptics>
                        </BootstrapProvider>
                    </AppActive>
                </VaultProvider>
            </FallbackProvider>
            <ChangesProgressDialog />
        </ActiveDeviceSceneProvider>
    </DeviceProvider>
);


const Structure = ({ children, route }) => {
    const { focused } = useDevices();

    if (!route.deviceFocusedNotNeeded && !focused) {
        return <Navigate to="/device/connect" replace />;
    }

    return (
        <>
            <StructureErrorBoundary>
                {!focused && children}
                {focused && (
                    <Content noHeader={!!route.noHeader} device={focused}>
                        {children}
                    </Content>
                )}
            </StructureErrorBoundary>
        </>
    );
};


const getElement = r => (
    <Structure route={r}>
        {r.element}
    </Structure>
);


const toChildRoute = (route) => {
    if (route === '/') return { index: true };
    if (route === '*') return { path: '*' };
    return { path: route.replace(/^\//, '') };
};


const RootLayout = () => (
    <GlobalHooks>
        <MobileBack>
            <Outlet />
        </MobileBack>
    </GlobalHooks>
);


const createAppRouter = () => createMemoryRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: routes.map(r => ({
            ...toChildRoute(r.route),
            element: getElement(r),
        })),
    },
], {
    initialEntries: ['/'],
});


// Exported
export default () => {
    const router = useMemo(() => createAppRouter(), []);

    return (
        <GlobalInitialization>
            <GlobalProvider>
                <RouterProvider router={router} />
            </GlobalProvider>
        </GlobalInitialization>
    );
};
