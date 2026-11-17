// Loads a model from disk for the tests (the browser loads the same files over HTTP).
import fs from 'node:fs'
import path from 'node:path'
import * as tf from '@tensorflow/tfjs'

export { tf }

export async function loadModel(dir: string) {
  return tf.loadLayersModel({
    load: async () => {
      const json = JSON.parse(fs.readFileSync(path.join(dir, 'model.json'), 'utf8'))
      const weightSpecs = json.weightsManifest.flatMap((g: { weights: unknown[] }) => g.weights)
      const data = Buffer.concat(json.weightsManifest.flatMap((g: { paths: string[] }) => g.paths.map((p) => fs.readFileSync(path.join(dir, p)))))
      return { modelTopology: json.modelTopology, weightSpecs, weightData: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) }
    },
  })
}

export const loadVocab = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8'))
