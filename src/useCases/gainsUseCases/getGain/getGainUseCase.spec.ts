import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { InMemoryGainsRepository } from '@repositories/inMemory/inMemoryGainsRepository'
import { GetGainUseCase, IGetGainUseCase } from './getGainUseCase'

describe('Get Gain use case tests', () => {
  let gainsRepository: IGainRepository
  let getGainUseCase: IGetGainUseCase

  const userId = 'userId'
  const gain = new Gain({ value: 30 })

  beforeAll(async () => {
    gainsRepository = InMemoryGainsRepository()

    await gainsRepository.createGain(userId, gain)

    getGainUseCase = GetGainUseCase(gainsRepository)
  })

  it('should be able to get a gain with matching user and gain id', async () => {
    const gottenGain = await getGainUseCase.execute({
      ownerId: userId,
      gainId: gain.id
    })

    expect(gottenGain).toBeTruthy()
    expect(gottenGain).toEqual(gain)
  })

  it('should return null if a non-matching user id is provided', async () => {
    const gottenGain = await getGainUseCase.execute({
      ownerId: 'non-matching userId',
      gainId: gain.id
    })

    expect(gottenGain).toBeNull()
  })

  it('should return null if a non-matching gain id is provided', async () => {
    const gottenGain = await getGainUseCase.execute({
      ownerId: userId,
      gainId: 'non-matching gainId'
    })

    expect(gottenGain).toBeNull()
  })
})
