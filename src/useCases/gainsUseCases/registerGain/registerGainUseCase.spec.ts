import { InMemoryGainsRepository } from '@repositories/inMemory/inMemoryGainsRepository'
import { RegisterGainUseCase } from './registerGainUseCase'

describe('Register Gain use case test', () => {
  it('should be able to create an gain with valid value field', async () => {
    const gainsRepository = InMemoryGainsRepository()
    const registerGainUseCase = RegisterGainUseCase(gainsRepository)

    const createdGain = await registerGainUseCase.execute({
      ownerId: 'userId',
      value: 30
    })

    const gottenGain = await gainsRepository.getGainById(
      'userId',
      createdGain.id
    )

    expect(gottenGain).toBeTruthy()
    expect(gottenGain).toEqual(createdGain)
  })

  it('should not be able to create an gain with negative value field', async () => {
    const gainsRepository = InMemoryGainsRepository()
    const registerGainUseCase = RegisterGainUseCase(gainsRepository)

    await expect(async () => {
      return await registerGainUseCase.execute({
        ownerId: 'userId',
        value: -30
      })
    }).rejects.toThrow()
  })
})
