import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'
import { InMemoryGainsRepository } from '@repositories/inMemory/inMemoryGainsRepository'
import { EditGainUseCase, IEditGainUseCase } from './editGainUseCase'

describe('Edit Gain use case tests', () => {
  let gainsRepository: IGainRepository
  let editGainUseCase: IEditGainUseCase

  const userId = 'userId'
  const gain = new Gain({ value: 50, gainedAt: new Date() })

  beforeEach(async () => {
    gainsRepository = InMemoryGainsRepository()
    await gainsRepository.createGain(
      userId,
      new Gain(
        {
          value: gain.value,
          gainedAt: gain.gainedAt
        },
        gain.id
      )
    )

    editGainUseCase = EditGainUseCase(gainsRepository)
  })

  it('should be able to edit a gain with all edit data', async () => {
    const newGainedAt = new Date(5000) // 5000 is a random value

    const editedGain = await editGainUseCase.execute({
      ownerId: userId,
      gainId: gain.id,
      value: 80,
      gainedAt: newGainedAt
    })

    expect(editedGain).toBeTruthy()
    expect(editedGain.id).toBe(gain.id)
    expect(editedGain).not.toEqual(gain)
    expect(editedGain.value).not.toBe(gain.value)
    expect(editedGain.gainedAt).not.toBe(gain.gainedAt)
  })

  it('should not be able to edit an user with negative value field', async () => {
    await expect(async () => {
      return await editGainUseCase.execute({
        ownerId: userId,
        gainId: gain.id,
        value: -80
      })
    }).rejects.toThrow()
  })

  it('should be able to edit only gain value', async () => {
    const editedGain = await editGainUseCase.execute({
      ownerId: userId,
      gainId: gain.id,
      value: 80
    })

    expect(editedGain).toBeTruthy()
    expect(editedGain.id).toBe(gain.id)
    expect(editedGain).not.toEqual(gain)
    expect(editedGain.value).not.toBe(gain.value)
    expect(editedGain.gainedAt).toBe(gain.gainedAt)
  })

  it('should be able to edit only gain gainedAt', async () => {
    const newGainedAt = new Date(5000) // 5000 is a random value

    const editedGain = await editGainUseCase.execute({
      ownerId: userId,
      gainId: gain.id,
      gainedAt: newGainedAt
    })

    expect(editedGain).toBeTruthy()
    expect(editedGain.id).toBe(gain.id)
    expect(editedGain).not.toEqual(gain)
    expect(editedGain.value).toBe(gain.value)
    expect(editedGain.gainedAt).not.toBe(gain.gainedAt)
  })

  it('should return the same gain if neither data is provided', async () => {
    const editedGain = await editGainUseCase.execute({
      ownerId: userId,
      gainId: gain.id
    })

    expect(editedGain).toBeTruthy()
    expect(editedGain).toEqual(gain)
  })

  it('should return null if a non-matching owner id is provided', async () => {
    const editedGain = await editGainUseCase.execute({
      ownerId: 'non-matching owner id',
      gainId: gain.id
    })

    expect(editedGain).toBeNull()
  })

  it('should return null if a non-matching gain id is provided', async () => {
    const editedGain = await editGainUseCase.execute({
      ownerId: userId,
      gainId: 'non-matching gain id'
    })

    expect(editedGain).toBeNull()
  })
})
