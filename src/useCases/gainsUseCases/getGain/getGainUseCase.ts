import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { IGetGainDTO } from './IGetGainDTO'

export interface IGetGainUseCase {
  execute({ ownerId, gainId }: IGetGainDTO): Promise<Gain | null>
}

export const GetGainUseCase = (gainsRepository: IGainRepository) => {
  const execute = async ({
    ownerId,
    gainId
  }: IGetGainDTO): Promise<Gain | null> => {
    return await gainsRepository.getGainById(ownerId, gainId)
  }

  return Object.freeze({ execute })
}
