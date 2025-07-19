import axios from 'axios'

const ELGATO_LIGHT_PORT = 9123

type LightOptions = {
    /** 0(off)-1(on) */
    on: 0 | 1
    /** 3-100 */
    brightness: number
    /** 143(7000K)-344(2900K) */
    temperature: number
}

const LIGHTS = {
    Main: '192.168.9.180',
    Fill: '192.168.9.170',
}

async function getLight(name: keyof typeof LIGHTS): Promise<LightOptions> {
    const ip = LIGHTS[name]
    if (!ip) {
        throw new Error(`Unknown light name: ${name}`)
    }

    const res = await axios.get(
        `http://${ip}:${ELGATO_LIGHT_PORT}/elgato/lights`
    )
    if (res.status != 200) {
        console.log('ERROR', res)
        throw new Error(`Failure to get light: ${ip}`)
    }
    if (res.data.numberOfLights != 1) {
        throw new Error(`Expected 1 light, got ${res.data.numberOfLights}`)
    }
    const light = res.data.lights[0]
    if (
        light.on === undefined ||
        light.brightness === undefined ||
        light.temperature === undefined
    ) {
        throw new Error(`Unexpected light data: ${JSON.stringify(light)}`)
    }
    return {
        on: light.on,
        brightness: light.brightness,
        temperature: light.temperature,
    }
}

async function setLight(name: keyof typeof LIGHTS, light: LightOptions) {
    const ip = LIGHTS[name as keyof typeof LIGHTS]
    if (!ip) {
        throw new Error(`Unknown light name: ${name}`)
    }
    const payload = {
        numberOfLights: 1,
        lights: [light],
    }
    const res = await axios.put(
        `http://${ip}:${ELGATO_LIGHT_PORT}/elgato/lights`,
        payload
    )
    if (res.status != 200) {
        console.log('ERROR', res)
        throw new Error(`Failure to invoke for light: ${ip}`)
    }
}

let lastValues = {
    brightness: 3,
    temperature: 344,
}

export async function on(name: keyof typeof LIGHTS, light: Omit<LightOptions, 'on'>) {
    lastValues = { ...light }
    await setLight(name, { on: 1, ...light })
}

export async function off(name: keyof typeof LIGHTS) {
    await setLight(name, { on: 0, ...lastValues })
}

export async function status(name: keyof typeof LIGHTS) {
    const status = await getLight(name)
    console.log(`Status for ${name} light:`, status)
    return status
}
