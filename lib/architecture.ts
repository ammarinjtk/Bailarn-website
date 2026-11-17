// Reads a model's Keras topology at build time and describes each layer in plain words, with its output shape.
// The pages render this, so the diagram always matches the model visitors download.
import fs from 'node:fs'
import path from 'node:path'

type Shape = (number | null)[]
type KerasLayer = {
  class_name: string
  name?: string
  config: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  inbound_nodes?: [string, number, number, unknown][][]
}

export type Layer = {
  label: string // what the layer does, e.g. "Bi-LSTM · 256 units each way"
  shape: string // output shape without the batch axis, e.g. "60 × 512"
  branch: number | null // parallel branch number for multi-branch (CNN) models
  note?: string // e.g. dropout applied after this layer
}

const fmt = (s: Shape) => s.slice(1).map((d) => (d === null ? 'n' : d.toLocaleString('en'))).join(' × ')

function outputShape(layer: KerasLayer, inputs: Shape[]): Shape {
  const c = layer.config
  const [x] = inputs
  switch (layer.class_name) {
    case 'InputLayer':
      return c.batch_input_shape
    case 'Embedding':
      return [...(x ?? c.batch_input_shape), c.output_dim]
    case 'Bidirectional': {
      const units = c.layer.config.units * (c.merge_mode === 'concat' ? 2 : 1)
      return c.layer.config.return_sequences ? [x[0], x[1], units] : [x[0], units]
    }
    case 'Dense':
    case 'TimeDistributed':
      return [...x.slice(0, -1), (c.layer?.config ?? c).units]
    case 'Conv1D': {
      const len = x[1] === null ? null : c.padding === 'same' ? x[1] : Math.floor((x[1] - c.kernel_size[0]) / c.strides[0]) + 1
      return [x[0], len, c.filters]
    }
    case 'MaxPooling1D': {
      const stride = (c.strides ?? c.pool_size)[0]
      return [x[0], x[1] === null ? null : Math.floor((x[1] - c.pool_size[0]) / stride) + 1, x[2]]
    }
    case 'Flatten':
      return [x[0], x.slice(1).reduce<number>((a, b) => a * (b ?? 1), 1)]
    case 'Concatenate': {
      const axis = c.axis < 0 ? x.length + c.axis : c.axis
      return x.map((d, i) => (i === axis ? inputs.reduce<number>((s, s2) => s + (s2[i] ?? 0), 0) : d))
    }
    case 'Dot':
      return [x[0], 1, 1]
    default:
      return x
  }
}

function label(layer: KerasLayer): string | null {
  const c = layer.config
  switch (layer.class_name) {
    case 'Embedding':
      return `Embedding · ${c.input_dim.toLocaleString('en')} ids → ${c.output_dim} dims`
    case 'Bidirectional':
      return `Bi-LSTM · ${c.layer.config.units} units each way`
    case 'TimeDistributed':
      return `Dense per position · ${c.layer.config.units} outputs, ${c.layer.config.activation}`
    case 'Dense':
      return `Dense · ${c.units} outputs, ${c.activation}`
    case 'Conv1D':
      return `Convolution · width ${c.kernel_size[0]}, ${c.filters} filters, ${c.activation}`
    case 'MaxPooling1D':
      return `Max pooling · window ${c.pool_size[0]}`
    case 'Flatten':
      return 'Flatten'
    case 'Concatenate':
      return 'Concatenate branches'
    case 'Dot':
      return c.normalize ? 'Cosine similarity of the two vectors' : 'Dot product'
    default:
      return null // InputLayer and Dropout are shown as the input row and as notes
  }
}

export function describeModel(model: string): { input: string; layers: Layer[] } {
  const topology = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'models', model, 'model.json'), 'utf8')).modelTopology
  const cfg = topology.model_config ?? topology
  const keras: KerasLayer[] = Array.isArray(cfg.config) ? cfg.config : cfg.config.layers
  const sequential = cfg.class_name === 'Sequential'

  const shapes = new Map<string, Shape[]>() // layer name -> output shape per call
  const branchOf = new Map<string, number | null>()
  const layers: Layer[] = []
  let inputShapes: Shape[] = []
  let prev: Shape | null = null
  let nextBranch = 1

  keras.forEach((layer, i) => {
    const name = layer.name ?? `layer_${i}`
    const nodes = sequential ? [[]] : layer.inbound_nodes?.length ? layer.inbound_nodes : [[]]
    const outs: Shape[] = []
    const parents = new Set<number | null>()
    for (const node of nodes) {
      const ins = sequential ? (prev ? [prev] : []) : node.map(([n, idx]) => shapes.get(n)![idx])
      node.forEach(([n]) => parents.add(branchOf.get(n) ?? null))
      outs.push(outputShape(layer, ins))
    }
    shapes.set(name, outs)
    prev = outs[0]

    // Branches: a layer whose input feeds several siblings starts a new branch; a merge ends them.
    const parent = parents.size === 1 ? [...parents][0] : null
    const siblings = sequential ? 0 : keras.filter((l) => l.inbound_nodes?.[0]?.[0]?.[0] === nodes[0]?.[0]?.[0]).length
    const branch = layer.class_name === 'Concatenate' ? null : siblings > 1 && parent === null ? nextBranch++ : parent
    branchOf.set(name, branch)

    if (layer.class_name === 'InputLayer' || (sequential && i === 0)) inputShapes.push(layer.config.batch_input_shape)
    if (layer.class_name === 'Dropout') {
      const last = layers[layers.length - 1]
      if (last) last.note = `then dropout ${layer.config.rate}`
      return
    }
    const text = label(layer)
    if (text) layers.push({ label: text, shape: fmt(outs[0]), branch })
  })

  inputShapes = inputShapes.filter(Boolean)
  const input = inputShapes.length > 1 ? `${inputShapes.length} inputs of ${fmt(inputShapes[0])}` : fmt(inputShapes[0])
  return { input, layers }
}
