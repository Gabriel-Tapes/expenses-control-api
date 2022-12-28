import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'

export interface IGetAllGainsUseCase {
  execute(userId: string): Promise<Gain[]>
}

export const GetAllGainsUseCase = (
  gainsRepository: IGainRepository
): IGetAllGainsUseCase => {
  const execute = async (userId: string): Promise<Gain[]> => {
    return await gainsRepository.getAllGains(userId)
  }

  return Object.freeze({ execute })
}
