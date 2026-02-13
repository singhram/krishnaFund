import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
     
    },
    {
        path:'login',
        loadComponent:() => import('./modules/core/components/login/login').then(m => m.Login),
     
    },
    {
        path:'user/add',
        loadComponent:() => import('./modules/core/components/createuser/createuser').then(m => m.Createuser),
        canActivate: [authGuard]

    },
    {
        path:'user/edit/:id',
        loadComponent:() => import('./modules/core/components/createuser/createuser').then(m => m.Createuser),
        canActivate: [authGuard]
    },
    {
        path:'group/add',
        loadComponent:() => import('./modules/core/components/creategroup/creategroup').then(m => m.Creategroup),
        canActivate: [authGuard]
    },
    {
        path:'group/edit/:id',
        loadComponent:() => import('./modules/core/components/creategroup/creategroup').then(m => m.Creategroup),
        canActivate: [authGuard]
    },
    {
        path:'userlist',
        loadComponent:()=>import('./modules/core/components/userlist/userlist').then(m => m.Userlist),
        canActivate: [authGuard]

    },
    {
        path:'usergrouplist/:groupId',
        loadComponent:()=>import('./modules/core/components/user-group-list/user-group-list').then(m => m.UserGroupList),
        canActivate: [authGuard]
    },
      {
        path:'grouplist',
        loadComponent:()=>import('./modules/core/components/grouplist/grouplist').then(m => m.Grouplist)
        ,
        canActivate: [authGuard]
    },
      {
        path:'userdetails/:id',
        loadComponent:()=>import('./modules/core/components/userdetail/userdetail').then(m => m.Userdetail),
        canActivate: [authGuard]
    }
];
