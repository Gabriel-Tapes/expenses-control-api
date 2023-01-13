import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { InMemoryGainsRepository } from '@repositories/inMemory/inMemoryGainsRepository'
import { DeleteGainUseCase, IDeleteGainUseCase } from './deleteGainUseCase'

describe('Delete Gain use case tests', () => {
  let gainsRepository: IGainRepository
  let deleteGainUseCase: IDeleteGainUseCase

  const userId = 'userId'
  const gain = new Gain({
    value: 30
  })

  beforeEach(async () => {
    gainsRepository = InMemoryGainsRepository()

    await gainsRepository.createGain(userId, gain)

    deleteGainUseCase = DeleteGainUseCase(gainsRepository)
  })

  it('should be able to delete an gain', async () => {
    await deleteGainUseCase.execute(userId, gain.id)

    expect(await gainsRepository.getGainById(userId, gain.id)).toBeNull()
  })

  it('should not delete the gain if a non-matching gain id is provided', async () => {
    await deleteGainUseCase.execute(userId, 'a non-matching id')

    const nonDeletedGain = await gainsRepository.getGainById(userId, gain.id)

    expect(nonDeletedGain).toBeTruthy()
    expect(nonDeletedGain).toEqual(gain)
  })

  it('should not delete the gain if a non-matching owner id is provided', async () => {
    await deleteGainUseCase.execute('a non-matching id', gain.id)

    const nonDeletedGain = await gainsRepository.getGainById(userId, gain.id)

    expect(nonDeletedGain).toBeTruthy()
    expect(nonDeletedGain).toEqual(gain)
  })
})
