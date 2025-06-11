import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArtifactFrame, ArtifactSyncer } from '@artifact/client/react'
import { HOST_SCOPE } from '@artifact/client/api'
import App from './App.tsx'
import { defaultInnovations } from './mockInnovations'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtifactFrame
      mockRepos={{ mock: { main: { 'innovations.json': defaultInnovations } } }}
      mockFrameProps={{
        target: { did: HOST_SCOPE.did, repo: 'mock', branch: 'main' }
      }}
    >
      <ArtifactSyncer>
        <App />
      </ArtifactSyncer>
    </ArtifactFrame>
  </StrictMode>
)
