import { useArtifact } from '@artifact/client/hooks'
import type { Innovation } from '../types/innovation'

const useInnovationsSaver = () => {
  const artifact = useArtifact()

  return async (data: Innovation[]): Promise<void> => {
    artifact.files.write.json('innovations.json', data)
    await artifact.branch.write.commit('Update innovations')
  }
}

export default useInnovationsSaver
