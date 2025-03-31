import { RouteObject } from 'react-router-dom';
import UserDetails from '../containers/UserList/UserDetails';
import UserList from '../containers/UserList';

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        element: <UserList />,
      },
      {
        path: 'users/:userId',
        element: <UserDetails />,
      },
    ],
  },
];

export default routes; 