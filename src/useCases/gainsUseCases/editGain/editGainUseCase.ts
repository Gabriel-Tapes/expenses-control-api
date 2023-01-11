import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { IEditGainDTO } from './IEditGainDTO'

export interface IEditGainUseCase {
  execute({ ownerId, gainId, value, gainedAt }: IEditGainDTO): Promise<Gain>
}

export const EditGainUseCase = (
  gainsRepository: IGainRepository
): IEditGainUseCase => {
  const execute = async ({
    ownerId,
    gainId,
    value,
    gainedAt
  }: IEditGainDTO): Promise<Gain> => {
    if (value < 0) throw new Error('Edit gain error: invalid value provided')

    return await gainsRepository.editGain({ ownerId, gainId, value, gainedAt })
  }

  return Object.freeze({ execute })
}
