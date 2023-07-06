import '../styles/globals.css'
import Link from 'next/link'
import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }) {
  return (
    <div>
   
      <Navbar/>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
