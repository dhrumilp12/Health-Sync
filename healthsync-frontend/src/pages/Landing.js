import React from 'react'
import Header from "../components/Header/Header"
import Main from "../components/Main/Main"
import Footer from "../components/Footer/Footer"

const Landing = () => {
  return (
    <div className="text-[#1d4d85] app min-w-[280px] min-h-screen bg-background">
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

export default Landing