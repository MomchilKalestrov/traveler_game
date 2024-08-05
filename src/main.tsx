import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/navbar'
import Home from './pages/home'
import Map from './pages/map'
import Settings from './pages/settings'
import './index.css'

let context: {
  pages: JSX.Element[],
  refs: React.RefObject<HTMLDivElement>[]
} = {
  pages: [],
  refs: []
};

for(let i = 0; i < 3; i++)
  context.refs.push(React.createRef());

context.pages.push(<div ref={ context.refs[0] } ><Home /></div>);
context.pages.push(<div ref={ context.refs[1] } ><Map /></div>);
context.pages.push(<div ref={ context.refs[2] } ><Settings /></div>);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    { context.pages }
    <Navbar context={ context.refs } />
  </React.StrictMode>
)
