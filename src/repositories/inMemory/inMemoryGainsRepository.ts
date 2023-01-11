import { Gain } from '@entities/gain'
import { editGainDTO, IGainRepository } from '@repositories/IGainsRepository'

interface GainsData {
  gain: Gain
  ownerId: string
}

export const InMemoryGainsRepository = (): IGainRepository => {
  let gains: GainsData[] = []

  const createGain = async (ownerId: string, gain: Gain): Promise<void> => {
    gains.push({ gain, ownerId })
  }

  const getGainById = async (
    ownerId: string,
    gainId: string
  ): Promise<Gain | null> => {
    const gainData = gains.find(
      gainData => gainData.gain.id === gainId && gainData.ownerId === ownerId
    )

    return gainData?.gain ?? null
  }

  const getAllGains = async (ownerId: string): Promise<Gain[]> => {
    return gains
      .filter(gainData => gainData.ownerId === ownerId)
      .map(gainData => gainData.gain)
  }

  const editGain = async ({
    ownerId,
    gainId,
    value,
    gainedAt
  }: editGainDTO): Promise<Gain | null> => {
    const gain = await getGainById(ownerId, gainId)

    if (!gain) return null

    if (!gainedAt && (value === null || value === undefined)) return gain

    gain.value = value ?? gain.value
    gain.gainedAt = gainedAt ?? gain.gainedAt

    return gain
  }

  const deleteGain = async (ownerId: string, gainId: string): Promise<void> => {
    gains = gains.filter(
      gainData => gainData.gain.id !== gainId && gainData.ownerId !== ownerId
    )
  }

  return Object.freeze({
    createGain,
    getGainById,
    getAllGains,
    editGain,
    deleteGain
  })
}
