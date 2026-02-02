
import { useState } from 'react'
import './App.css'
import VideoPlayer from './VideoPlayer'

function App() {
  return (
    <>
      <h1>Notflix</h1>
      <div className="card">
        <VideoPlayer />
      </div>
    </>
  )
}

export default App
