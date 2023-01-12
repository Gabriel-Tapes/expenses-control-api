import { InMemoryGainsRepository } from './inMemoryGainsRepository'
import { Gain } from '@entities/gain'
describe('In memory Gains repository tests', () => {
  it('should be able to create an gain', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    const createdGain = await gainsRepository.getGainById('ownerId', gain.id)

    expect(createdGain).toBeTruthy()
    expect(createdGain).toEqual(gain)
  })

  it('should be able to get a gain with matching id and ownerId', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    const gottenGain = await gainsRepository.getGainById('ownerId', gain.id)

    expect(gottenGain).toBeTruthy()
    expect(gottenGain).toEqual(gain)
  })

  it('should be able to get a gain with matching id and ownerId', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    const notFoundGain = await gainsRepository.getGainById(
      'ownerId',
      'invalid id'
    )

    expect(notFoundGain).toBeNull()
  })

  it('should be able to get all gains for an owner with matching ownerId', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain1 = new Gain({ value: 30 })
    const gain2 = new Gain({ value: 40 })

    await gainsRepository.createGain('ownerId', gain1)
    await gainsRepository.createGain('ownerId', gain2)

    const ownerGains = await gainsRepository.getAllGains('ownerId')

    expect(ownerGains.length).toBe(2)
    expect(ownerGains).toEqual([gain1, gain2])
  })

  it('should be return an empty list for an non-matching ownerId', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain1 = new Gain({ value: 30 })
    const gain2 = new Gain({ value: 40 })

    await gainsRepository.createGain('ownerId', gain1)
    await gainsRepository.createGain('ownerId', gain2)

    const ownerGains = await gainsRepository.getAllGains('invalid ownerId')

    expect(ownerGains.length).toBe(0)
  })

  it('should be able to edit an gain', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    const editedGain = await gainsRepository.editGain({
      ownerId: 'ownerId',
      gainId: gain.id,
      value: 60
    })

    expect(editedGain.value).toBe(60)
  })

  it('should be return null when try to edit an gain with non-matching ownerId or gainId', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    const editedGain = await gainsRepository.editGain({
      ownerId: 'non-matching ownerId',
      gainId: gain.id,
      value: 60
    })

    expect(editedGain).toBeNull()
  })

  it('should return the same gain if not gainedAt and value are provided', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    const editedGain = await gainsRepository.editGain({
      ownerId: 'ownerId',
      gainId: gain.id
    })

    expect(editedGain).toBeInstanceOf(Gain)
    expect(editedGain).toEqual(gain)
  })

  it('should be able to delete an gain', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    await gainsRepository.deleteGain('ownerId', gain.id)

    const deletedGain = await gainsRepository.getGainById('ownerId', gain.id)

    expect(deletedGain).toBeNull()
  })

  it('should not delete an gain if a non-matching gain id is provided', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    await gainsRepository.deleteGain('ownerId', 'non-matching gain id')

    const deletedGain = await gainsRepository.getGainById('ownerId', gain.id)

    expect(deletedGain).toBeTruthy()
    expect(deletedGain).toEqual(gain)
  })

  it('should not delete an gain if a non-matching owner id is provided', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    await gainsRepository.deleteGain('non-matching owner id', gain.id)

    const deletedGain = await gainsRepository.getGainById('ownerId', gain.id)

    expect(deletedGain).toBeTruthy()
    expect(deletedGain).toEqual(gain)
  })

  it('should not delete an gain if a non-matching owner and gain id are provided', async () => {
    const gainsRepository = InMemoryGainsRepository()

    const gain = new Gain({ value: 30 })

    await gainsRepository.createGain('ownerId', gain)

    await gainsRepository.deleteGain(
      'non-matching owner id',
      'non-matching gain id'
    )

    const deletedGain = await gainsRepository.getGainById('ownerId', gain.id)

    expect(deletedGain).toBeTruthy()
    expect(deletedGain).toEqual(gain)
  })
})
