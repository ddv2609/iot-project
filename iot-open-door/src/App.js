import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LayoutDefault from './pages/LayoutDefault/LayoutDefault';
import Home from './pages/Home/Home';
import Video  from './pages/Video/Video';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LayoutDefault />}>
          <Route index element={<Home />} />
          <Route path='/video' element={<Video />} />
          <Route path='/admin' element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
