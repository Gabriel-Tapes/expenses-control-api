import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { IGetGainDTO } from './IGetGainDTO'

export interface IGetGainUseCase {
  execute({
    gainId
  }: IGetGainDTO): Promise<{ gain: Gain; ownerId: string } | null>
}

export const GetGainUseCase = (gainsRepository: IGainRepository) => {
  const execute = async ({
    gainId
  }: IGetGainDTO): Promise<{ gain: Gain; ownerId: string } | null> => {
    return await gainsRepository.getGainById(gainId)
  }

  return Object.freeze({ execute })
}
