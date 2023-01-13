import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { InMemoryGainsRepository } from '@repositories/inMemory/inMemoryGainsRepository'
import { GetAllGainsUseCase, IGetAllGainsUseCase } from './getAllGainsUseCase'

describe('Get all Gains use case tests', () => {
  let gainsRepository: IGainRepository
  let getAllGainsUseCase: IGetAllGainsUseCase

  const userId = 'userId'
  const gain1 = new Gain({ value: 30 })
  const gain2 = new Gain({ value: 40 })
  const gain3 = new Gain({ value: 50 })

  beforeAll(async () => {
    gainsRepository = InMemoryGainsRepository()

    await gainsRepository.createGain(userId, gain1)
    await gainsRepository.createGain(userId, gain2)
    await gainsRepository.createGain(userId, gain3)

    getAllGainsUseCase = GetAllGainsUseCase(gainsRepository)
  })

  it('should be able to get all gains of an user with matching userId', async () => {
    const gains = await getAllGainsUseCase.execute(userId)

    expect(gains).toBeTruthy()
    expect(gains.length).toBe(3)
    expect(gains).toEqual([gain1, gain2, gain3])
  })

  it('should return an empty lest with a  non-matching userId', async () => {
    const gains = await getAllGainsUseCase.execute('non-matching userId')

    expect(gains).toBeTruthy()
    expect(gains.length).toBe(0)
  })
})
