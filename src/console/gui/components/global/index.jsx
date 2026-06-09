// Requirements
import { useMemo } from 'react';
import {
    createMemoryRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from 'react-router';
import { ChangesContext, DeviceContext } from '@magical-mixing/mixers-react';
import routes from '../../routes';
import { useDevices } from '../devices/context';
import Layout from '../layout';
import { FallbackContext } from '../fallback';
import { VaultContext } from '../vault';
import GlobalContext from './context';
import GlobalHooks from './hooks';
import GlobalInitialization from './initialization';
import { AppActive } from './appActive';
import { MobileBack, MobileOfflineHaptics } from './mobile';
import { ChangesCallout, GlobalErrorCallout } from './callout';
import { StructureErrorBoundary } from './errorBoundary';
import '../../style/main.css';


// Internal
const Content = ({ noHeader, device, children }) => (
    <DeviceContext device={device}>
        <FallbackContext>
            <VaultContext>
                <AppActive>
                    <MobileOfflineHaptics>
                        {noHeader && children}
                        {!noHeader && (
                            <Layout>
                                {children}
                            </Layout>
                        )}
                    </MobileOfflineHaptics>
                </AppActive>
            </VaultContext>
        </FallbackContext>
    </DeviceContext>
);


const Structure = ({ children, route }) => {
    const { focused } = useDevices();

    if (!route.deviceFocusedNotNeeded && !focused) {
        return <Navigate to="/device/connect" replace />;
    }

    return (
        <ChangesContext>
            <StructureErrorBoundary>
                {!focused && children}
                {focused && (
                    <Content noHeader={!!route.noHeader} device={focused}>
                        {children}
                    </Content>
                )}
            </StructureErrorBoundary>
            <GlobalErrorCallout />
            <ChangesCallout />
        </ChangesContext>
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
            <GlobalContext>
                <RouterProvider router={router} />
            </GlobalContext>
        </GlobalInitialization>
    );
};
