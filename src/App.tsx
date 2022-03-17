import { Fragment } from 'react';
import { useRoutes } from 'react-router-dom';
import { routeTable } from './routes';
import './App.scss';

function App() {
  // 根据路由表自动生成路由组件
  const element = useRoutes(routeTable);
  return (
    <Fragment>
      {element}
    </Fragment>
  )
}

export default App;
