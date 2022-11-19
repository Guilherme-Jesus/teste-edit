export interface Children {
  blockId: string
  name: string
  abrv: string
  blockParent: string
  leafParent: boolean
  date: string
  data: {
    windSpeed: number
    solarIrradiation: number
    temperature: number
    rain: number
    relativeHumidity: number
  }
  children: Children[]
}

export type Daum = {
  id: string
  title: string
  subtitle: string
  blockParent: string
  leafParent: boolean
  date: string
  data: {
    windSpeed: number
    solarIrradiation: number
    temperature: number
    rain: number
    relativeHumidity: number
  }
  children: Children[]
}
export type IListBlocks = {
  name: string
  abrv: string
  blockId: string
  blockParent: string
  data: {
    atmosphericPressure: number
    rain: number
    relativeHumidity: number
    solarIrradiation: number
    temperature: number
    windSpeed: number
  }
  date: string
  leafParent: boolean
}
export interface Block {
  blockId: string
  name: string
  blockParent: string
}
