// Requirements
import { createRoot } from 'react-dom/client';
import Global from './components/global';


// Main
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Global />);
