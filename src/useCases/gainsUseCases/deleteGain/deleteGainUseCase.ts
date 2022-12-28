import { IGainRepository } from '@repositories/IGainsRepository'

export interface IDeleteGainUseCase {
  execute(ownerId: string, gainId: string): Promise<void>
}

export const DeleteGainUseCase = (gainsRepository: IGainRepository) => {
  const execute = async (ownerId: string, gainId: string): Promise<void> => {
    const gain = await gainsRepository.getGainById(gainId)

    if (!gain) throw new Error('Gain not found')

    if (ownerId !== gain.ownerId) throw new Error('access denied')

    await gainsRepository.deleteGain(gainId)
  }

  return Object.freeze({ execute })
}
