import { IGainRepository } from '@repositories/IGainsRepository'

export interface IDeleteGainUseCase {
  execute(ownerId: string, gainId: string): Promise<void>
}

export const DeleteGainUseCase = (gainsRepository: IGainRepository) => {
  const execute = async (ownerId: string, gainId: string): Promise<void> => {
    await gainsRepository.deleteGain(ownerId, gainId)
  }

  return Object.freeze({ execute })
}
