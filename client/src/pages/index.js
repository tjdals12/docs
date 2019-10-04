import withSplitting from 'hocs/withSplitting';

export const DashboardPage = withSplitting(() => import('./DashboardPage'));
export const DocumentsPage = withSplitting(() => import('./DocumentsPage'));
export const VendorsPage = withSplitting(() => import('./VendorsPage'));
export const IndexesOverallPage = withSplitting(() => import('./IndexesPage/IndexesOverallPage'));
export const IndexesDetailPage = withSplitting(() => import('./IndexesPage/IndexesDetailPage'));
export const IndexesInfosPage = withSplitting(() => import('./IndexesPage/IndexesInfosPage'));
export const VendorLettersPage = withSplitting(() => import('./LettersPage/VendorLettersPage'));
export const LettersPage = withSplitting(() => import('./LettersPage/LettersPage'));
export const SettingsPage = withSplitting(() => import('./SettingsPage'));
