import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/navbar'
import Home from './pages/home'
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

context.pages.push(<Home ref={ context.refs[0] } />);
context.pages.push(<Home ref={ context.refs[1] } />);
context.pages.push(<Home ref={ context.refs[2] } />);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Navbar context={ context.refs } />
  </React.StrictMode>
)
