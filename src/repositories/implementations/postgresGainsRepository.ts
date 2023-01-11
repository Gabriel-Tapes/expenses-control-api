import { Pool } from 'pg'
import { createDatabaseConnection } from '@database/connectDatabase'
import { Gain } from '@entities/gain'
import { editGainDTO, IGainRepository } from '@repositories/IGainsRepository'

export const PostgresGainsRepository = (): IGainRepository => {
  let client: Pool

  const connectDatabase = async () => {
    if (!client) client = await createDatabaseConnection()
  }

  const createGain = async (ownerId: string, gain: Gain): Promise<void> => {
    await connectDatabase()

    await client.query(
      'INSERT INTO GAINS (ID, VALUE, GAINED_AT, OWNER_ID) VALUES ($1, $2, $3, $4)',
      [gain.id, gain.value, gain.gainedAt, ownerId]
    )
  }

  const getGainById = async (
    ownerId: string,
    gainId: string
  ): Promise<Gain | null> => {
    await connectDatabase()

    const { rows } = await client.query(
      'SELECT * FROM GAINS WHERE ID = $1 AND OWNER_ID = $2',
      [gainId, ownerId]
    )

    if (!rows.length) return null

    const { value, gained_at: gainedAt } = rows[0]

    const gain = new Gain(
      {
        value,
        gainedAt
      },
      gainId
    )

    return gain
  }

  const getAllGains = async (ownerId: string): Promise<Gain[]> => {
    await connectDatabase()

    const { rows } = await client.query(
      'SELECT * FROM GAINS WHERE OWNER_ID = $1',
      [ownerId]
    )

    if (!rows.length) return []

    const allUserGains = rows.map(gain => {
      return new Gain(
        {
          value: gain.value,
          gainedAt: gain.gained_at
        },
        gain.id
      )
    })

    return allUserGains
  }

  const editGain = async ({
    ownerId,
    gainId,
    value,
    gainedAt
  }: editGainDTO): Promise<Gain> => {
    await connectDatabase()

    const oldGain = await getGainById(ownerId, gainId)

    if (!oldGain) return null

    if (!gainedAt && (value === undefined || value === null)) return oldGain

    const editedGain = new Gain(
      {
        value: value ?? oldGain.value,
        gainedAt: gainedAt ?? oldGain.gainedAt
      },
      gainId
    )

    await client.query(
      'UPDATE GAINS SET VALUE = $1 GAINED_AT = $2 WHERE ID = $3 AND OWNER_ID = $4',
      [editedGain.value, editedGain.gainedAt, gainId, ownerId]
    )

    return editedGain
  }

  const deleteGain = async (ownerId: string, gainId: string): Promise<void> => {
    await connectDatabase()

    await client.query('DELETE FROM GAINS WHERE ID = $1 AND OWNER_ID = $2', [
      gainId,
      ownerId
    ])
  }

  return Object.freeze({
    createGain,
    getGainById,
    getAllGains,
    editGain,
    deleteGain
  })
}
