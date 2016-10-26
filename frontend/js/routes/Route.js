import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import BooksQuery from './BooksQuery';
import UsersQuery from './UsersQuery';
import App from '../components/App';
import AppForm from '../components/AppForm';
import BookEditor from '../components/BookEditor/BookEditor';

function handleSubmit(values){
  console.log(values)
}

export default (
  <Route path='/' component={App} >
    <IndexRoute component={()=>{return <BookEditor /> }} />
    <Route path='/app' component={AppForm} />
    <Route path='/editor' component={BookEditor} />

    <Redirect from='*' to='/' />
  </Route>
);
