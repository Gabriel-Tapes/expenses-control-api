import { IGainRepository } from '@repositories/IGainsRepository'
import { newDb } from 'pg-mem'
import { PostgresGainsRepository } from './postgresGainsRepository'
import { v4 } from 'uuid'
import { Gain } from '@entities/gain'
import { runMigrations } from '@database/runMigrations'

const userId = v4()

jest.mock('@database/connectDatabase', () => ({
  createDatabaseConnection: jest.fn(async () => {
    const { Pool } = newDb().adapters.createPg()

    const connection = new Pool()

    await runMigrations(connection)

    await connection.query(
      `
      INSERT INTO USERS (ID, NAME, LAST_NAME, EMAIL, PASSWORD)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [userId, 'Joe', 'Doe', 'joe.doe@exemple.com', 'password']
    )

    return connection
  })
}))

describe('Postgres Gains repository tests', () => {
  let gainsRepository: IGainRepository

  const gain = new Gain({ value: 30 })

  beforeEach(() => {
    gainsRepository = PostgresGainsRepository()
  })

  describe('Create gain', () => {
    it('should be able to create a gain', async () => {
      await gainsRepository.createGain(userId, gain)

      const gottenGain = await gainsRepository.getGainById(userId, gain.id)

      expect(gottenGain).toBeTruthy()
      expect(gottenGain.id).toEqual(gain.id)
      expect(gottenGain.value).toEqual(gain.value)
    })

    it('should not be able to create a gain with a non-matching user id', async () => {
      const nonMatchingUserId = v4()

      await expect(async () => {
        return await gainsRepository.createGain(nonMatchingUserId, gain)
      }).rejects.toThrow()
    })
  })

  describe('Get gain by id', () => {
    it('should be able to get a gain', async () => {
      await gainsRepository.createGain(userId, gain)
      const gottenGain = await gainsRepository.getGainById(userId, gain.id)

      expect(gottenGain).toBeTruthy()
      expect(gottenGain.id).toEqual(gain.id)
      expect(gottenGain.value).toEqual(gain.value)
    })

    it('should return null if a non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      const gottenGain = await gainsRepository.getGainById(
        nonMatchingUserId,
        gain.id
      )

      expect(gottenGain).toBeNull()
    })

    it('should return null if a non-matching gain id is provided', async () => {
      const nonMatchingGainId = v4()

      const gottenGain = await gainsRepository.getGainById(
        nonMatchingGainId,
        gain.id
      )

      expect(gottenGain).toBeNull()
    })

    it('should return null if a invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      const gottenGain = await gainsRepository.getGainById(
        invalidUserId,
        gain.id
      )

      expect(gottenGain).toBeNull()
    })

    it('should return null if a invalid gain id is provided', async () => {
      const invalidGainId = 'invalid gain id'

      const gottenGain = await gainsRepository.getGainById(
        invalidGainId,
        gain.id
      )

      expect(gottenGain).toBeNull()
    })
  })

  describe('Get all gains', () => {
    it('should be able to get all gains', async () => {
      await gainsRepository.createGain(userId, gain)
      const allGains = await gainsRepository.getAllGains(userId)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(1)
    })

    it('should return an empty array if no gains are found', async () => {
      const userIdWithNoGains = v4()

      const allGains = await gainsRepository.getAllGains(userIdWithNoGains)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(0)
    })

    it('should return an empty array if an invalid user id is provided', async () => {
      const invalidUserId = 'an invalid user id'

      const allGains = await gainsRepository.getAllGains(invalidUserId)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(0)
    })
  })

  describe('Edit gain', () => {
    const editedGain = new Gain({ value: gain.value + 20 }, gain.id)

    beforeEach(async () => {
      await gainsRepository.createGain(userId, gain)
    })

    it('should return the edited gain if valid data is given', async () => {
      const gottenGain = await gainsRepository.editGain({
        ownerId: userId,
        gainId: editedGain.id,
        value: editedGain.value,
        gainedAt: editedGain.gainedAt
      })

      expect(gottenGain).toBeTruthy()
      expect(gottenGain.id).toEqual(editedGain.id)
      expect(gottenGain.value).toEqual(editedGain.value)
    })

    it('should return the same gain if value and gainedAt are not provided', async () => {
      const gottenGain = await gainsRepository.editGain({
        ownerId: userId,
        gainId: editedGain.id
      })

      expect(gottenGain).toBeTruthy()
      expect(gottenGain.id).toEqual(gain.id)
      expect(gottenGain.value).toEqual(gain.value)
    })

    it('should return null if a non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      const gottenGain = await gainsRepository.editGain({
        ownerId: nonMatchingUserId,
        gainId: editedGain.id,
        value: editedGain.value,
        gainedAt: editedGain.gainedAt
      })

      expect(gottenGain).toBeNull()
    })

    it('should return null if a invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      const gottenGain = await gainsRepository.editGain({
        ownerId: invalidUserId,
        gainId: editedGain.id,
        value: editedGain.value,
        gainedAt: editedGain.gainedAt
      })

      expect(gottenGain).toBeNull()
    })

    it('should return null if a non-matching user id is provided', async () => {
      const nonMatchingGainId = v4()

      const gottenGain = await gainsRepository.editGain({
        ownerId: userId,
        gainId: nonMatchingGainId,
        value: editedGain.value,
        gainedAt: editedGain.gainedAt
      })

      expect(gottenGain).toBeNull()
    })

    it('should return null if a invalid gain id is provided', async () => {
      const invalidGainId = 'invalid gain id'

      const gottenGain = await gainsRepository.editGain({
        ownerId: userId,
        gainId: invalidGainId,
        value: editedGain.value,
        gainedAt: editedGain.gainedAt
      })

      expect(gottenGain).toBeNull()
    })
  })

  describe('Delete gain', () => {
    beforeEach(async () => {
      await gainsRepository.createGain(userId, gain)
    })

    afterEach(async () => {
      await gainsRepository.deleteGain(userId, gain.id)
    })

    it('should be able to delete a gain', async () => {
      await gainsRepository.deleteGain(userId, gain.id)

      const allGains = await gainsRepository.getAllGains(userId)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(0)
    })

    it('should not delete the gain if a non-matching user id is provided', async () => {
      const nonMatchingUserId = v4()

      await gainsRepository.deleteGain(nonMatchingUserId, gain.id)

      const allGains = await gainsRepository.getAllGains(userId)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(1)
    })

    it('should not delete the gain if a non-matching gain id is provided', async () => {
      const nonMatchingGainId = v4()

      await gainsRepository.deleteGain(userId, nonMatchingGainId)

      const allGains = await gainsRepository.getAllGains(userId)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(1)
    })

    it('should not delete the gain if a invalid user id is provided', async () => {
      const invalidUserId = 'invalid user id'

      await gainsRepository.deleteGain(invalidUserId, gain.id)

      const allGains = await gainsRepository.getAllGains(userId)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(1)
    })

    it('should not delete the gain if a invalid gain id is provided', async () => {
      const invalidGainId = 'invalid gain id'

      await gainsRepository.deleteGain(userId, invalidGainId)

      const allGains = await gainsRepository.getAllGains(userId)

      expect(allGains).toBeTruthy()
      expect(allGains).toHaveLength(1)
    })
  })
})
