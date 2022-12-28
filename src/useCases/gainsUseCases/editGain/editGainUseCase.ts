import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { IEditGainDTO } from './IEditGainDTO'

export interface IEditGainUseCase {
  execute({ ownerId, gainId, newValue }: IEditGainDTO): Promise<Gain>
}

export const EditGainUseCase = (
  gainsRepository: IGainRepository
): IEditGainUseCase => {
  const execute = async ({
    ownerId,
    gainId,
    newValue
  }: IEditGainDTO): Promise<Gain> => {
    if (!newValue) throw new Error('Edit gain error: not value provided')

    if (newValue < 0) throw new Error('Edit gain error: invalid value provided')

    const { gain, ownerId: gainOwnerId } = await gainsRepository.getGainById(
      gainId
    )

    if (!gain) throw new Error('Edit gain error: gain not found')
    if (ownerId !== gainOwnerId) throw new Error('access denied')

    gain.value = newValue

    return await gainsRepository.editGain(gain)
  }

  return Object.freeze({ execute })
}
