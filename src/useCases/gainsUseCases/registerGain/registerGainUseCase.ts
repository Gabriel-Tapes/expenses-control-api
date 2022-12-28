import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { IRegisterGainDTO } from './IRegisterGainDTO'

export interface IRegisterGainUseCase {
  execute({ ownerId, value }: IRegisterGainDTO): Promise<Gain>
}

export const RegisterGainUseCase = (
  gainsRepository: IGainRepository
): IRegisterGainUseCase => {
  const execute = async ({
    ownerId,
    value
  }: IRegisterGainDTO): Promise<Gain> => {
    const gain = new Gain({ value })

    await gainsRepository.createGain(ownerId, gain)

    return gain
  }

  return Object.freeze({ execute })
}
